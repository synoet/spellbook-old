import * as pulumi from "@pulumi/pulumi";
import * as digitalocean from "@pulumi/digitalocean";
import * as kubernetes from "@pulumi/kubernetes";

const cluster = new digitalocean.KubernetesCluster("spellbook", {
  region: digitalocean.Region.NYC1,
  version: "latest",
  nodePool: {
    name: "default",
    size: digitalocean.DropletSlug.DropletS2VCPU2GB,
    nodeCount: 1,
  },
});

const provider = new kubernetes.Provider("spellbook", {});
