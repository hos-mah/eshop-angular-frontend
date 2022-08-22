# EshopAngularFrontend

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 12.2.12.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

## Secure Communication - HTTPS

Generate Key and Self-Signed Certificate

1. Open a command-prompt window.

2. Move into the directory of your Angular ecommerce project.

    `cd angular-ecommerce`

3. Create a new directory for your output files

    `mkdir ssl-localhost`

4. Create a configuration file for the OpenSSL utility.

    a. In the directory: `eshop-angular-fronten`

    b. Create a new file named: `localhost.conf`

5. OpeLook at the content of `localhost.conf` file 

6. In the terminal window, run this command to generate the key and certificate. Be sure to enter this command as a single line.
    `openssl req -x509 -out ssl-localhost/localhost.crt -keyout ssl-localhost/localhost.key -newkey rsa:2048 -nodes -sha256 -days 365 -config localhost.conf`

7. This command generates the following output:

    <code>Generating a 2048 bit RSA private key &nbsp;<br/>
    .......+++&nbsp;<br/>
    ...............................+++&nbsp; <br/>
    writing new private key to 'ssl-localhost/localhost.key'
    </code>


8. The command generates two files: `localhost.crt` and `localhost.key`.

9. View the contents of your certificate.

    `openssl x509 -noout -text -in ssl-localhost/localhost.crt`

    Sample Output

    <code>
    Certificate:<br/>
        Data:<br/>
            Version: 1 (0x0)<br/>
            Serial Number:<br/>
                32:1e:11:1b:6d:fa:5f:0d:74:bc:03:a8:1d:36:c6:4d:52:99:86:bb<br/>
            Signature Algorithm: sha256WithRSAEncryption<br/>
            Issuer: C = NL, ST = North Brabant, L = Eindhoven, O = personalOrg, OU = Training, CN = localhost<br/>
            Validity<br/>
                Not Before: Aug 21 15:32:37 2022 GMT<br/>
                Not After : Aug 21 15:32:37 2023 GMT<br/>
            Subject: C = NL, ST = North Brabant, L = Eindhoven, O = personalOrg, OU = Training, CN = localhost<br/>
            Subject Public Key Info:<br/>
                Public Key Algorithm: rsaEncryption<br/>
                    RSA Public-Key: (2048 bit)<br/>
                    Modulus:<br/>
                    ...

    </code>
