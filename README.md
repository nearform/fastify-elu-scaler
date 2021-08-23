# fastify-elu-scaler

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
$ helm install keda kedacore/keda --version 1.4.2 --namespace keda
```

## Build

We provided an simple nodejs app including a Dockerfile to build an container image exposing a metric endpoint for ELU.

```bash
$ docker build -t elu:latest .
```

## Deploy

To deploy our application and scaler to Kubernetes we prepared some manifest files.

```bash
$ kubectl create namespace elu
$ kubectl apply -f manifests/
```

## How it works



