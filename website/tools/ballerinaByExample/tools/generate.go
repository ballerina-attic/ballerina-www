package main

import (
    "crypto/sha1"
    "fmt"
    "github.com/russross/blackfriday"
    "io/ioutil"
    "net/http"
    "os"
    "os/exec"
    "path/filepath"
    "regexp"
    "strings"
    "text/template"
    "bytes"
)

var cacheDir = "/tmp/gobyexample-cache"
var pygmentizeBin = "tools/ballerinaByExample/vendor/pygments/pygmentize"
var githubBallerinaByExampleBaseURL = "https://github.com/ballerina-platform/ballerina-lang/tree/master/docs/ballerina-by-example"
var examplesDir = os.Args[1];
var siteDir = os.Args[2];

var descFileContent = ""
var completeCode = ""
var ignoreSegment = false
func check(err error) {
    if err != nil {
        panic(err)
    }
}

func ensureDir(dir string) {
    err := os.MkdirAll(dir, 0755)
    check(err)
}

func copyFile(src, dst string) {
    dat, err := ioutil.ReadFile(src)
    check(err)
    err = ioutil.WriteFile(dst, dat, 0644)
    check(err)
}

func pipe(bin string, arg []string, src string) []byte {
    cmd := exec.Command(bin, arg...)
    in, err := cmd.StdinPipe()
    check(err)
    out, err := cmd.StdoutPipe()
    check(err)
    err = cmd.Start()
    check(err)
    _, err = in.Write([]byte(src))
    check(err)
    err = in.Close()
    check(err)
    bytes, err := ioutil.ReadAll(out)
    check(err)
    err = cmd.Wait()
    check(err)
    return bytes
}

func sha1Sum(s string) string {
    h := sha1.New()
    h.Write([]byte(s))
    b := h.Sum(nil)
    return fmt.Sprintf("%x", b)
}

func mustReadFile(path string) string {
    bytes, err := ioutil.ReadFile(path)
    check(err)
    return string(bytes)
}

func cachedPygmentize(lex string, src string) string {
    ensureDir(cacheDir)
    arg := []string{"-l", lex, "-f", "html"}
    cachePath := cacheDir + "/pygmentize-" + strings.Join(arg, "-") + "-" + sha1Sum(src)
    cacheBytes, cacheErr := ioutil.ReadFile(cachePath)
    if cacheErr == nil {
        return string(cacheBytes)
    }
    renderBytes := pipe(pygmentizeBin, arg, src)
    // Newer versions of Pygments add silly empty spans.
    renderCleanString := strings.Replace(string(renderBytes), "<span></span>", "", -1)
    writeErr := ioutil.WriteFile(cachePath, []byte(renderCleanString), 0600)
    check(writeErr)
    return renderCleanString
}

func markdown(src string) string {
    return string(blackfriday.MarkdownCommon([]byte(src)))
}

func readLines(path string) []string {
    src := mustReadFile(path)
    return strings.Split(src, "\n")
}

func mustGlob(glob string) []string {
    paths, err := filepath.Glob(glob)
    check(err)
    return paths
}

func whichLexer(path string) string {
    if strings.HasSuffix(path, ".go") {
        return "go"
        //} else if strings.HasSuffix(path, ".client.sh") {
        //    return "client"
        //} else if strings.HasSuffix(path, ".server.sh") {
        //    return "server"
    } else if strings.HasSuffix(path, ".sh") {
        return "console"
    } else if strings.HasSuffix(path, ".bal") {
        return "bal"
    } else if strings.HasSuffix(path, ".description") {
        return "description"
    }
    panic("No lexer for " + path)
    return ""
}

func debug(msg string) {
    if os.Getenv("DEBUG") == "1" {
        fmt.Fprintln(os.Stderr, msg)
    }
}

var docsPat = regexp.MustCompile("^\\s*(\\/\\/|#|@\\s*Description\\s*\\{\\s*value\\s*:\\s*\\\")")
var docsEndPat = regexp.MustCompile("\\s*\\\"\\s*\\}\\s*")
var dashPat = regexp.MustCompile("\\-+")

type Seg struct {
    Docs, DocsRendered              string
    Code, CodeRendered              string
    CodeEmpty, CodeLeading, CodeRun,IsConsoleOutput,DocEmpty bool
}

type Example struct {
    Id, Name                    string
    GoCode, GoCodeHash, UrlHash string
    Segs                        [][]*Seg
    Descs			string
    NextExample                 *Example
    PrevExample                 *Example
    FullCode			string
    GithubLink          string
}

func parseHashFile(sourcePath string) (string, string) {
    lines := readLines(sourcePath)
    return lines[0], lines[1]
}

func resetUrlHashFile(codehash, code, sourcePath string) string {
    payload := strings.NewReader(code)
    resp, err := http.Post("https://play.golang.org/share", "text/plain", payload)
    if err != nil {
        panic(err)
    }
    defer resp.Body.Close()
    body, err := ioutil.ReadAll(resp.Body)
    urlkey := string(body)
    data := fmt.Sprintf("%s\n%s\n", codehash, urlkey)
    ioutil.WriteFile(sourcePath, []byte(data), 0644)
    return urlkey
}

func parseSegs(sourcePath string) ([]*Seg, string) {
    lines := readLines(sourcePath)

    filecontent := strings.Join(lines, "\n")
    segs := []*Seg{}
    lastSeen := ""
    for _, line := range lines {
        if line == "" {
            lastSeen = ""
            continue
        }
        matchDocs := docsPat.MatchString(line)
        matchCode := !matchDocs
        newDocs := (lastSeen == "") || (lastSeen != "docs")
        newCode := (lastSeen == "") || ((lastSeen != "code") && (segs[len(segs)-1].Code != ""))
        if newDocs || newCode {
            debug("NEWSEG")
        }
        if matchDocs {
            trimmed := docsPat.ReplaceAllString(line, "")
            trimmed = docsEndPat.ReplaceAllString(trimmed, "")

            if newDocs {
                newSeg := Seg{Docs: trimmed, Code: ""}
                segs = append(segs, &newSeg)
            } else {
                segs[len(segs)-1].Docs = segs[len(segs)-1].Docs + "\n" + trimmed
            }
            debug("DOCS: " + line)
            lastSeen = "docs"
        } else if matchCode {
            if strings.HasPrefix(line, "import ballerina.doc;") {
                lastSeen = "code"
                continue
            }
            if newCode {
                newSeg := Seg{Docs: "", Code: line}
                segs = append(segs, &newSeg)

            } else {
                segs[len(segs)-1].Code = segs[len(segs)-1].Code + "\n" + line
            }
            debug("CODE: " + line)
            lastSeen = "code"
        }
    }
    for i, seg := range segs {
        seg.CodeEmpty = (seg.Code == "")
        seg.DocEmpty = (seg.Docs == "")
        seg.CodeLeading = (i < (len(segs) - 1))
        seg.CodeRun = strings.Contains(seg.Code, "package main")
        seg.IsConsoleOutput = strings.HasSuffix(sourcePath, ".sh")
    }
    if strings.HasSuffix(sourcePath, ".bal") {
        //segs[0].Docs = descFileContent
        descFileContent = "";
    }
    return segs, filecontent
}

func parseAndRenderSegs(sourcePath string) ([]*Seg, string, string) {
    segs, filecontent := parseSegs(sourcePath)
    lexer := whichLexer(sourcePath)
    ignoreSegment = false
    completeCode = ""
    for _, seg := range segs {
        if seg.Docs != "" {
            seg.DocsRendered = markdown(seg.Docs)
        }
        if seg.Code != "" {
            seg.CodeRendered = cachedPygmentize(lexer, seg.Code)
            if (!ignoreSegment) {
                if (!strings.Contains(seg.Code, "$ ")) {
                    completeCode = completeCode + seg.Code
                } else {
                    ignoreSegment = true;
                }
            }
        }
    }
    // we are only interested in the 'go' code to pass to play.golang.org
    if lexer != "go" || lexer != "bal" {
        filecontent = ""
    }
    return segs, filecontent, completeCode
}

func parseExamples() []*Example {
    exampleNames := readLines(examplesDir + "/" + "examples.txt")
    examples := make([]*Example, 0)
    for _, exampleName := range exampleNames {
        if (exampleName != "") && !strings.HasPrefix(exampleName, "#") {
            example := Example{Name: exampleName}
            exampleId := strings.ToLower(exampleName)
            exampleId = strings.Replace(exampleId, " ", "-", -1)
            exampleId = strings.Replace(exampleId, "/", "-", -1)
            exampleId = strings.Replace(exampleId, "'", "", -1)
            exampleId = dashPat.ReplaceAllString(exampleId, "-")
            example.Id = exampleId
            example.Segs = make([][]*Seg, 0)
            sourcePaths := mustGlob(examplesDir + "/" + "examples/" + exampleId + "/*")

            // Re-arranging the order of files
            rearrangedPaths := make([]string, 0)
            fileDirPath := examplesDir + "/examples/" + exampleId + "/"

            descFilePath := fileDirPath + exampleId + ".description"

            balFilePath := fileDirPath + exampleId + ".bal"
            if !isFileExist(balFilePath) {
                continue;
            }
            rearrangedPaths = appendFilePath(rearrangedPaths, descFilePath);

            rearrangedPaths = appendFilePath(rearrangedPaths, balFilePath);
            
            shFilePath := fileDirPath + exampleId + ".sh"
            if isFileExist(shFilePath) {
                rearrangedPaths = append(rearrangedPaths, shFilePath)
            } else {
                rearrangedPaths = appendFilePath(rearrangedPaths, fileDirPath + exampleId + ".server.sh");
                rearrangedPaths = appendFilePath(rearrangedPaths, fileDirPath + exampleId + ".client.sh");
            }
            sourcePaths = rearrangedPaths;

            for _, sourcePath := range sourcePaths {
                if strings.HasSuffix(sourcePath, ".hash") {
                    example.GoCodeHash, example.UrlHash = parseHashFile(sourcePath)
                } else {
                    sourceSegs, filecontents, fullcode := parseAndRenderSegs(sourcePath)
                    if filecontents != "" {
                        example.GoCode = filecontents
                    }

                    // We do this since the ".description" file is not read first. If it is the first file in the
                    // directory, it will be read first. then we don't need this check.What we do
                    if strings.HasSuffix(sourcePath, ".description") {
                        descFileContent = sourceSegs[0].Docs;
			example.Descs = descFileContent;
                    } else {
                        example.Segs = append(example.Segs, sourceSegs)
                    }
		    example.FullCode = example.FullCode + fullcode

                }
            }

            example.FullCode = cachedPygmentize("bal", example.FullCode)
            newCodeHash := sha1Sum(example.GoCode)
            if example.GoCodeHash != newCodeHash {
                example.UrlHash = resetUrlHashFile(newCodeHash, example.GoCode, "examples/"+example.Id+"/"+example.Id+".hash")
            }
            example.GithubLink = githubBallerinaByExampleBaseURL+ "/examples/"+example.Id+"/"
            examples = append(examples, &example)
        }
    }

    for i, example := range examples {
        if i < (len(examples) - 1) {
            example.NextExample = examples[i+1]
        }
    }

    for i, example := range examples {
        if i != 0 {
            example.PrevExample = examples[i-1]
        }
    }

    return examples
}

func renderIndex(examples []*Example) {
    indexTmpl := template.New("index")
    _, err := indexTmpl.Parse(mustReadFile("tools/ballerinaByExample/templates/index.tmpl"))
    check(err)
    indexF, err := os.Create(siteDir + "/index.html")
    check(err)
    indexTmpl.Execute(indexF, examples)
}

func renderExamples(examples []*Example) {
    exampleTmpl := template.New("example")
    _, err := exampleTmpl.Parse(mustReadFile("tools/ballerinaByExample/templates/example.tmpl"))
    check(err)

    var exampleItem bytes.Buffer
    for _, example := range examples {
        exampleF, err := os.Create(siteDir + "/" + example.Id+".html")
        exampleItem.WriteString(example.Id)
        check(err)
        exampleTmpl.Execute(exampleF, example)
    }
    generateJSON(exampleItem.String())
}

func generateJSON(example string) {
  d1 := []byte(example+"\n")
  err := ioutil.WriteFile(siteDir+"/examples.json", d1, 0644)
  check(err)
}

func appendFilePath(filePaths []string, filePath string) ([]string) {
    if isFileExist(filePath) {
        filePaths = append(filePaths, filePath)
    } else {
        fmt.Fprintln(os.Stderr, filePath +  " is not available")
        os.Exit(1)
    }
    return filePaths;
}

// Check whether the file exists.
func isFileExist(path string) bool {
    if _, err := os.Stat(path); err != nil {
        if os.IsNotExist(err) {
            return false
        } else {
            fmt.Fprintln(os.Stderr, fmt.Sprintf("unable to read file '%v'", path), err.Error())
            os.Exit(1);
        }
    }
    return true
}

func main() {
    copyFile("tools/ballerinaByExample/templates/site.css", siteDir+"/site.css")
    copyFile("tools/ballerinaByExample/templates/ballerina-example.css", siteDir+"/ballerina-example.css")
    copyFile("tools/ballerinaByExample/templates/favicon.ico", siteDir+"/favicon.ico")
    copyFile("tools/ballerinaByExample/templates/404.html", siteDir+"/404.html")
    copyFile("tools/ballerinaByExample/templates/play.png", siteDir+"/play.png")
    examples := parseExamples()
    renderIndex(examples)
    renderExamples(examples)
}
