#!/bin/bash
# Deploys dist/amplify.zip to AWS Amplify Hosting ("deploy without Git").
# Creates the app and branch on the first run, reuses them afterwards.
#
#   deploy/amplify-deploy.sh                 # app "one-of-250", branch "main", region from your AWS config
#   APP_NAME=my-game AWS_REGION=eu-central-1 deploy/amplify-deploy.sh
set -euo pipefail
cd "$(dirname "$0")/.."

APP_NAME="${APP_NAME:-one-of-250}"
BRANCH="${BRANCH:-main}"
ZIP=dist/amplify.zip
HEADERS="$(cat deploy/customHttp.yml)"

command -v aws >/dev/null || { echo "AWS CLI not found. Install: https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html, then run 'aws configure'."; exit 1; }
aws sts get-caller-identity >/dev/null || { echo "AWS credentials are not set up. Run 'aws configure' (or 'aws sso login')."; exit 1; }

./build.sh
[ -f "$ZIP" ] || { echo "$ZIP was not built"; exit 1; }

APP_ID="$(aws amplify list-apps --query "apps[?name=='${APP_NAME}'].appId | [0]" --output text)"
if [ "$APP_ID" = "None" ] || [ -z "$APP_ID" ]; then
  echo "Creating Amplify app ${APP_NAME}…"
  APP_ID="$(aws amplify create-app --name "$APP_NAME" --platform WEB --custom-headers "$HEADERS" --query app.appId --output text)"
else
  aws amplify update-app --app-id "$APP_ID" --custom-headers "$HEADERS" >/dev/null
fi

if ! aws amplify get-branch --app-id "$APP_ID" --branch-name "$BRANCH" >/dev/null 2>&1; then
  echo "Creating branch ${BRANCH}…"
  aws amplify create-branch --app-id "$APP_ID" --branch-name "$BRANCH" --stage PRODUCTION >/dev/null
fi

read -r JOB_ID UPLOAD_URL < <(aws amplify create-deployment --app-id "$APP_ID" --branch-name "$BRANCH" --query "[jobId, zipUploadUrl]" --output text)
echo "Uploading ${ZIP} (job ${JOB_ID})…"
curl --fail --silent --show-error -X PUT -T "$ZIP" -H "Content-Type: application/zip" "$UPLOAD_URL"
aws amplify start-deployment --app-id "$APP_ID" --branch-name "$BRANCH" --job-id "$JOB_ID" >/dev/null

for _ in $(seq 1 60); do
  STATUS="$(aws amplify get-job --app-id "$APP_ID" --branch-name "$BRANCH" --job-id "$JOB_ID" --query job.summary.status --output text)"
  case "$STATUS" in
    SUCCEED) echo "Deployed: https://${BRANCH}.${APP_ID}.amplifyapp.com"; exit 0 ;;
    FAILED|CANCELLED) echo "Deployment ${STATUS}. See the Amplify console for job ${JOB_ID}."; exit 1 ;;
  esac
  sleep 5
done
echo "Still running after 5 minutes. Check the Amplify console for job ${JOB_ID}."
