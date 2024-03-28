node("server-ui") {
  deleteDir();
  stage("SCM") {
    checkout scm;
  }

  stage("Generate") {
    sh(
      script: "npm install",
      label: "Install packages"
    );

    sh(
      script: "npm run build",
      label: "Building"
    );
  }

  if (env.BRANCH_NAME == "master") {
    stage("Deploy") {
      def target = "/var/www/tools.openspaceproject.com/html";

      sh(
        script: "rm -rf ${target}/*",
        label: "Remove old files"
      );

      sh(
        script: "mv out/* ${target}",
        label: "Deploy files"
      );
    }
  }


  if (env.BRANCH_NAME != "master") {
    echo("Skipping the deployment as we are not working on the 'master' branch")
    currentBuild.result = "NOT_BUILT";
  }
}
