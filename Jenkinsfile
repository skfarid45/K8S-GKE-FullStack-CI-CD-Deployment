pipeline {
    agent any

    environment {
        PROJECT_ID = 'farid-practice'
        REGION     = 'us-central1-a'
        CLUSTER    = 'cluster-1'

        FRONTEND_IMAGE = "gcr.io/${PROJECT_ID}/frontend"
        BACKEND_IMAGE  = "gcr.io/${PROJECT_ID}/backend"
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/skfarid45/K8S-GKE-FullStack-CI-CD-Deployment.git'
            }
        }

        stage('Authenticate GCP') {
            steps {
                withCredentials([file(credentialsId: 'gcp-sa-key', variable: 'GOOGLE_APPLICATION_CREDENTIALS')]) {
                    sh '''
                    gcloud auth activate-service-account --key-file=$GOOGLE_APPLICATION_CREDENTIALS
                    gcloud config set project $PROJECT_ID
                    gcloud auth configure-docker -q
                    '''
                }
            }
        }

        stage('Build Images') {
            steps {
                sh '''
                docker build -t $FRONTEND_IMAGE:$BUILD_NUMBER Frontend
                docker build -t $BACKEND_IMAGE:$BUILD_NUMBER Backend
                '''
            }
        }

        stage('Push Images') {
            steps {
                sh '''
                docker push $FRONTEND_IMAGE:$BUILD_NUMBER
                docker push $BACKEND_IMAGE:$BUILD_NUMBER
                '''
            }
        }

        stage('Deploy to GKE') {
            steps {
                sh '''
                gcloud container clusters get-credentials $CLUSTER \
                  --region $REGION --project $PROJECT_ID

                sed -e "s|IMAGE_TAG|$BUILD_NUMBER|g" \
                    -e "s|PROJECT_ID|$PROJECT_ID|g" \
                    k8s/*.yaml | kubectl apply -f -
                '''
            }
        }
    }
}

