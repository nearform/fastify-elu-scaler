# fastify-elu-scaler

> This readonly repository contains sample code accompanying the published blog post [Event Loop Utilization with HPA](https://www.nearform.com/blog/event-loop-utilization-with-hpa/). For demonstration purposes only and not to be used in production.

## Prerequisites

To deploy this example of an evelt loop utilizer you need already access to an up and running kubernetes cluster. This could be for example [kinD] or [minikube] for testing compose but any cluster is fine.
Also needed is [Helm 3] to be installed to deploy required tools into kubernetes like [Prometheus] and [Grafana] as well as CRDs of [Keda]

Do not forget to setup your kubeconfig environment variable correctly to point to the right cluster
```bash
export KUBECONFIG=${PATH_TO_YOUR_KUBECONFIG}
```
### Prometheus/Grafana

Let's have Prometheus and Grafana to be installed to monitor and visualize our ELU metric

```bash
$ kubectl create -f manifests/setup
$ kubectl create -f manifests/
```

### Keda
We want to use Keda to auto scale our Pod

```bash
$ kubectl create namespace keda
$ helm repo add kedacore https://kedacore.github.io/charts
$ helm repo update
$ helm upgrade -i keda -n keda --create-namespace kedacore/keda
```

## Build

We provided an simple nodejs app including a Dockerfile to build an container image exposing a metric endpoint for ELU.

```bash
$ docker build -t elu:latest .
```

Make sure your Docker image is accessible from within your Kubernetes cluster.

## Deploy

To deploy our application and scaler to Kubernetes we prepared some manifest files.

```bash
$ kubectl create namespace elu
$ kubectl apply -f manifests/
```

## How it works

By default, we defined a threshold of 20 for up-/downscaleing in [scaledObject.yaml](./manifests/scaledObject.yaml) which is related to the average over all percentiles of our ELU metric, factorized by 100.

```yaml
triggers:
  - type: prometheus
    metadata:
      metricName: event_loop_utilization
      threshold: '20'
      serverAddress: "http://prometheus-k8s.monitoring:9090"
      query: 100*avg(event_loop_utilization{service="elu"})
```

After deployment is done, you open your Grafana via Proxy forwarding and watch your Pod and the ELU metric.

```bash
$ export POD=$(kubectl -n monitoring get pod -l app.kubernetes.io/component=grafana --template '{{range .items}}{{.metadata.name}}{{"\n"}}{{end}}')
$ kubectl -n monitoring port-forward $POD 3000:3000
```

You can now visit [http://localhost:3000/explore] and watch the pod ELU.

To trigger your auto scaler you can use apaches benchmark tool [ab]

```bash
$ kubectl run -it --rm --image=piegsaj/ab bench -- -c 20000 -n 100000 http://elu.elu:3000
$ kubectl -n elu get pods --watch
```

[kinD]: https://kind.sigs.k8s.io/
[minikube]: https://minikube.sigs.k8s.io/
[Helm 3]: https://helm.sh/
[Prometheus]: https://prometheus.io/
[Grafana]: https://grafana.com/
[Keda]: https://keda.sh/
[ab]: https://httpd.apache.org/docs/2.4/programs/ab.html
[http://localhost:3000/explore]: http://localhost:3000/explore?orgId=1&left=%5B%22now-1h%22,%22now%22,%22prometheus%22,%7B%22exemplar%22:true,%22expr%22:%22100*avg(event_loop_utilization%7Bservice%3D%5C%22elu%5C%22%7D)%22%7D%5D
