$ ballerina build
Pulling dependencies…
  ballerinax/http     [central.ballerina.io -> home repo] [====>] 56/56 
  ballerinax/rpc      [central.ballerina.io -> home repo] [====>] 98/98
  ballerinax/twitter  [central.ballerina.io -> home repo] [====>] 79/79 

Building binaries…
  something.bal ⇒ target/something.balo
  something.bal ⇒ target/something.balo
  something.bal ⇒ target/something.balo

Running tests…
  Test <mytest> ⇒ RUNNING … SUCCESS
  Test <mytest> ⇒ RUNNING … SUCCESS
  Test <mytest> ⇒ RUNNING … SUCCESS

Generating deployment artifacts…
  @docker                 - complete 1/1
  @kubernetes:ingress     - complete 3/3
  @kubernetes:svc         - complete 3/3
  @kubernetes:deployment  - complete 1/1

SUCCESS

$ tree
/
  .ballerina/             # Dependencies downloaded and cached locally
  Ballerina.toml          # Defines project build intent
  my.package/             # Any folder is a package                 
    RouterService.bal           
    tests/
      RouterTests.bal
  target/
      kubernetes
         docker
             Dockerfile
         something_k8s_svc.yaml
         something_k8s_deployment.yaml


$ kubectl apply -f target/kubernetes/