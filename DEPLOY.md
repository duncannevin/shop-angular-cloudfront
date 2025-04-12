# 🛍️ WebApp + AWS CDK Infrastructure

## Prerequisites

- AWS CLI
- Authenticated AWS account in the cli

Before you begin be sure to bootstrap your AWS account with the CDK. This is a one-time setup.

```bash
  npx cdk bootstrap
```

This command will ask you for your AWS account and region. You can find this information in your cli with `aws sts get-caller-identity`.

## Preview Infrastructure Changes

```bash
  npm run cdk:diff
```

## Synthesize CloudFormation Template

```bash
  npm run cdk:synth
```

## Deploy Infrastructure Changes

```bash
  npm run cdk:deploy
```

## Destroy Infrastructure

```bash
  npm run cdk:destroy
```
