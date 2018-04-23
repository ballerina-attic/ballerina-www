# How to Observe Ballerina Programs

## Introduction
Observability is a measure of how well internal states of a system can be inferred from knowledge of its external outputs. Monitoring, logging, and distributed tracing are key methods which reveals the internal state of the system, indeed the observability. Therefore ballerina provides default support for monitoring metrics such as request count and response time statistics, log processing and analysis, and distributed tracing according to [OpenTracing](https://github.com/opentracing/specification/blob/master/specification.md) specification, which collectively yields the full observability for ballerina services. 

Ballerina services that are using the below mentioned service/client connectors are observable by default. 
* HTTP/HTTPS
* SQL 

## Quick Start
Ballerina service is by default observable. However observability is disabled by default and it can be enabled by either adding inline parameter and upating the configuration.

### Inline Parameter
Observability for ballerina service can be enabled with a short hand inline parameter --observe as shown below. This enables observability for ballerina service with default settings, and publish the distributed tracing information to [Jaeger](https://www.jaegertracing.io/) and metrics information to [Prometheus](https://prometheus.io/). 

```
$ ballerina run hello_service.bal --observe

```

### Configuration file
Observability can be enabled from configuration. An example configuration which starts observability with metrics monitoring and distributed tracing with default configurations is given below. 

```
[b7a.observability.tracing]
# Flag to enable Tracing
enabled=true

[b7a.observability.metrics]
# Flag to enable Metrics
enabled=true
```

The ballerina program needs to be started as below with eith --config or -c inline parameter and provide the path of the configuration file to adhere to the configuration.

```
$ ballerina run hello_service.bal --config <path-to-conf>/ballerina.conf
```
 
## Metrics Monitoring
Metrics help to monitor the runtime behaviour of the service. Therefore, metrics is a vital part of monitoring Ballerina or actually considered as monitoring itself. However, metrics is not the same as analytics. For example, you should not use metrics to do something like per-request billing. Metrics are used to measure what Ballerina code does in runtime to make better decisions using the numbers. The code generates business value when it is run in production. Therefore, it is imperative to continuously measure the code in production.

Metrics, by default, supports Prometheus. In order to support Prometheus, an HTTP endpoint starts with the context of `/metrics` in default port 9797 when starting the Ballerina program. 

### Configuration
This section focuses on the ballerina configurations that are available for metrics monitoring with Prometheus, and the sample configuration is provided below.

```
[b7a.observability.metrics]
enabled=true
provider="micrometer"

[b7a.observability.metrics.micrometer]
registry.name="prometheus"

[b7a.observability.metrics.prometheus]
port=9797
hostname="0.0.0.0"
descriptions=false
step="PT1M"
```

The descriptions of each configurations above is provided below with possible alternate options.

|Configuration Key | Description | Default Value | Possible Values 
|--- | --- | --- | --- 
|b7a.observability.metrics.enabled | Whether metrics monitoring is enabled (true) or disabled (false) | false | true / false 


## Distributed Tracing

Tracing provides information regarding the roundtrip of a service invocation based on the concept of spans, which are structured in a hierarchy based on the cause and effect concept. Tracers propagate across several services, depicting a high level view of interconnections among services as well, hence coining the term distributed tracing.

A span is a logical unit of work, which encapsulates a start and end time as well as metadata to give more meaning to the unit of work being completed. For example a span representing a client call to an HTTP endpoint would give the user the latency of the client call and metadata like the HTTP URL being called and HTTP method used. If the span represents an SQL client call, the metadata would include the query being executed.

Tracing gives the user a high-level view of how a single service invocation is processed across several distributed microservices. 

* Identify service bottlenecks - The user can monitor the latency’s and identify when a service invocation slows down, pinpoint where the slowing down happens (by looking at the span latency’s) and take action to improve the latency.
* Error identification - If an error occurs during the service invocation, it will show up in the list of tracers. The user can easily identify where the error occurred and information of the error will be attached to the relevant span as metadata.

Ballerina supports [OpenTracing](http://opentracing.io/) standards out of the box. This means that Ballerina services can be traced using OpenTracing implementations like [Jaeger](http://www.jaegertracing.io/).

```
[b7a.observability]

[b7a.observability.tracing]
enabled=true
name="jaeger"

[b7a.observability.tracing.jaeger]
reporter.hostname="localhost"
reporter.port=5775
sampler.param=1.0
sampler.type="const"
reporter.flush.interval.ms=2000
reporter.log.spans=true
reporter.max.buffer.spans=1000
```

## Observing Hello World Sample Service

### Configure Ballerina
Consider following sample service.

```ballerina
import ballerina/http;

service<http:Service> hello bind { port:9090 } {
	sayHello (endpoint conn, http:Request req) {
    	http:Response res = new;
    	res.setStringPayload("Hello, World!");
    	_ = conn -> respond(res);
	}
}
```

Save the above service as `hello-world-service.bal`.

In the same directory, create a `ballerina.conf` file and add the following.

```
[observability]

[observability.metrics]
enabled=true
port=9797

[observability.tracing]
enabled=true
```

### Configure External Systems
We will use docker images for external systems.

#### Prometheus
Prometheus is used as the monitoring system.

We need to create a prometheus.yml file in /tmp/ directory.

Use following content for /tmp/prometheus.yml. See https://prometheus.io/docs/introduction/first_steps/

```
global:
  scrape_interval: 	15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: 'prometheus'
	static_configs:
  	  - targets: ['172.17.0.1:9797']
```

Make sure to use your local Docker IP.

Run docker:

```bash
docker run -p 19090:9090 -v /tmp/prometheus.yml:/etc/prometheus/prometheus.yml \ prom/prometheus
```

See https://prometheus.io/docs/prometheus/latest/installation/

Prometheus can be accessed from http://localhost:19090/

#### Grafana
Let’s use Grafana to visualize metrics.

Run docker:

```bash
docker run -d --name=grafana -p 3000:3000 grafana/grafana
```

See https://hub.docker.com/r/grafana/grafana/


#### Jaeger
Jaeger is used for distributed tracing.

Run docker:

```bash
docker run -d -p5775:5775/udp -p6831:6831/udp -p6832:6832/udp -p5778:5778 -p16686:16686 -p14268:14268 jaegertracing/all-in-one:latest
```

See also: https://jaegertracing.netlify.com/docs/getting-started/#all-in-one-docker-image

### Observing Requests
Start Ballerina Hello World Service.

```bash
$ ballerina run hello-world-service.bal
ballerina: started Prometheus HTTP endpoint localhost/127.0.0.1:9797
ballerina: started publishing tracers to Jaeger on localhost:5775
ballerina: initiating service(s) in 'hello-world-service.bal'
ballerina: started HTTP/WS endpoint 0.0.0.0:9090
```

Send few requests to http://localhost:9090/hello/sayHello

Example cURL command:

```
curl http://localhost:9090/hello/sayHello
```

#### Metrics
Metrics are available from http://localhost:9797/metrics

Open http://localhost:19090/ in your browser to view Metrics from Prometheus.

Ballerina will by default have following metrics for HTTP server connector.
* http_requests_total
* http_response_time


Select a metric and view graph.

Let’s use Grafana to visualize.

Open http://localhost:3000/

Default admin user is admin/admin.

Add Prometheus as a datasource (http://localhost:19090) with direct access.

After adding a datasource, we can create dashboards. For example, see following screenshot to add Requests Rate Graph.

We will develop a standard Ballerina Dashboard, which can be imported to Prometheus later.

Since we use Micrometer to collect metrics, we can directly import the dashboard in https://grafana.com/dashboards/4701 to view JVM Metrics.

#### Tracing
Open Jaeger UI to view tracing: http://localhost:16686
