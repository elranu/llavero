const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');

module.exports = {
  hooks: {
    packageAfterPrune: async (
      config,
      buildPath,
      electronVersion,
      platform,
      arch,
    ) => {
      console.log('Executing packageAfterPrune hook...'); // Log statement to confirm hook execution

      const commands = [
        'add',
        'serialport',
        '@aws-cdk/cloudformation-diff', // Add @aws-cdk/cloudformation-diff module
      ];

      try {
        // Log the contents of node_modules before adding the modules
        const filesBefore = fs.readdirSync(
          path.join(buildPath, 'node_modules'),
        );
        console.log(
          'Contents of node_modules before adding modules:',
          filesBefore,
        );

        // Ensure package.json is present throughout the build process
        await new Promise((resolve, reject) => {
          exec(
            `yarn ${commands.join(' ')}`,
            {
              cwd: buildPath,
              stdio: 'inherit',
              shell: true,
            },
            (error, stdout, stderr) => {
              if (error) {
                console.error('Error executing yarn add command:', error);
                reject(error);
              } else {
                console.log(
                  'yarn add serialport and @aws-cdk/cloudformation-diff command executed successfully',
                );
                resolve();
              }
            },
          );
        });

        if (platform === 'win32') {
          const problematicPaths = [
            'android-arm',
            'android-arm64',
            'darwin-x64+arm64',
            'linux-arm',
            'linux-arm64',
            'linux-x64',
          ];

          problematicPaths.forEach((binaryFolder) => {
            fs.rmSync(
              path.join(
                buildPath,
                'node_modules',
                '@serialport',
                'bindings-cpp',
                'prebuilds',
                binaryFolder,
              ),
              { recursive: true, force: true },
            );
          });
        }

        // Log the contents of node_modules to verify presence of all expected modules
        const filesAfter = fs.readdirSync(path.join(buildPath, 'node_modules'));
        console.log(
          'Contents of node_modules after adding modules:',
          filesAfter,
        );
        // Check if "@aws-cdk/cloudformation-diff" is present
        if (filesAfter.includes('@aws-cdk')) {
          const awsCdkFiles = fs.readdirSync(
            path.join(buildPath, 'node_modules', '@aws-cdk'),
          );
          console.log('Contents of @aws-cdk:', awsCdkFiles);
          // Check if "cloudformation-diff" is present
          if (awsCdkFiles.includes('cloudformation-diff')) {
            console.log('@aws-cdk/cloudformation-diff module is present');
          } else {
            console.error('@aws-cdk/cloudformation-diff module is missing');
          }
        } else {
          console.error('@aws-cdk directory is missing');
        }
      } catch (error) {
        console.error('Error executing yarn add command:', error);
        throw error;
      }
    },
  },
  packagerConfig: {
    ignore: (file) => {
      // Ensure that the package.json file and @aws-cdk/cloudformation-diff module are not ignored
      if (
        file.includes('package.json') ||
        file.includes('@aws-cdk/cloudformation-diff')
      ) {
        return false;
      }
      // Do not ignore any other files
      return false;
    },
  },
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {},
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {},
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
  ],
};
