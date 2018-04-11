import argparse
import sys

import jinja2
import markdown


reload(sys)
sys.setdefaultencoding('utf8')
TEMPLATE = """
<div class="release_notes">
{{content}}
</div>
"""


def parse_args(args=None):
    d = 'Make a complete, styled HTML document from a Markdown file.'
    parser = argparse.ArgumentParser(description=d)
    requiredNamed = parser.add_argument_group('required arguments')
    requiredNamed.add_argument('-m', '--mdfile',required=True, type=argparse.FileType('r'),
                        help='File to convert.' )
    parser.add_argument('-o', '--out', type=argparse.FileType('w'),
                        default=sys.stdout,
                        help='Output file name. Defaults to stdout.')
    return parser.parse_args(args)


def main(args=None):
    args = parse_args(args)
    print 'Reading markdown from'
    print args.mdfile
    print '-------------------'

    md = args.mdfile.read()
    extensions = ['extra', 'smarty']
    html = markdown.markdown(md, extensions=extensions, output_format='html5')
    doc = jinja2.Template(TEMPLATE).render(content=html)
    print 'Writing converted html to '
    print args.out
    print '-------------------'
    args.out.write(doc)


if __name__ == '__main__':
    sys.exit(main())