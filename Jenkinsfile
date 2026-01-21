pipeline {
    agent any

    environment {
        PROJECT_ID = 'farid-practice'

        REGION  = 'us-central1'
        ZONE    = 'us-central1-a'
        CLUSTER = 'cluster-1'
        REPO    = 'devops-repo'

        FRONTEND_IMAGE = "us-central1-docker.pkg.dev/${PROJECT_ID}/${REPO}/frontend"
        BACKEND_IMAGE  = "us-central1-docker.pkg.dev/${PROJECT_ID}/${REPO}/backend"
    }

    stages {

        stage('Checkout Code') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/skfarid45/K8S-GKE-FullStack-CI-CD-Deployment.git'
            }
        }

        stage('GCP Authentication') {
            steps {
                withCredentials([file(credentialsId: 'gcp-sa-key', variable: 'GCP_KEY')]) {
                    sh '''
                    gcloud auth activate-service-account --key-file=$GCP_KEY
                    gcloud config set project $PROJECT_ID
                    gcloud auth configure-docker us-central1-docker.pkg.dev -q
                    '''
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                sh '''
                docker build -t $FRONTEND_IMAGE:$BUILD_NUMBER Frontend/
                docker build -t $BACKEND_IMAGE:$BUILD_NUMBER Backend/
                '''
            }
        }

        stage('Push Docker Images') {
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
                  --zone $ZONE --project $PROJECT_ID

                sed -e "s|IMAGE_TAG|$BUILD_NUMBER|g" \
                    k8s/*.yaml | kubectl apply -f -
                '''
            }
        }
    }
}
