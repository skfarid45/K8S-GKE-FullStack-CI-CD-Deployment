pipeline {
  agent any

  environment {
    PROJECT_ID = 'YOUR_PROJECT_ID'
    FRONTEND_IMAGE = "gcr.io/${PROJECT_ID}/frontend"
    BACKEND_IMAGE  = "gcr.io/${PROJECT_ID}/backend"
  }

  stages {
    stage('Checkout') {
      steps {
        git 'https://github.com/YOUR_USERNAME/gke-fullstack-cicd.git'
      }
    }

    stage('Build Images') {
      steps {
        sh '''
        docker build -t $FRONTEND_IMAGE:$BUILD_NUMBER frontend/
        docker build -t $BACKEND_IMAGE:$BUILD_NUMBER backend/
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
        sed -i "s|IMAGE_TAG|$BUILD_NUMBER|" k8s/*.yaml
        sed -i "s|PROJECT_ID|$PROJECT_ID|" k8s/*.yaml
        kubectl apply -f k8s/
        '''
      }
    }
  }
}
