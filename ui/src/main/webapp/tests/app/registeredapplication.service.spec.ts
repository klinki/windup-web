import {HttpModule, BaseRequestOptions, Http, ConnectionBackend} from '@angular/http';
import {TestBed, async, inject} from '@angular/core/testing';
import 'rxjs/Rx';

import {Constants} from '../../app/constants';
import {RegisteredApplicationService} from "../../app/services/registeredapplication.service";
import {RegisteredApplication} from "windup-services";
import {KeycloakService} from "../../app/services/keycloak.service";
import {FileService} from "../../app/services/file.service";
import {MockBackend} from "@angular/http/testing";
import {FileUploader} from "ng2-file-upload/ng2-file-upload";

describe("Registered Application Service Test", () => {
    beforeEach(() => {
        TestBed.configureTestingModule(
            {
                imports: [HttpModule],
                providers: [
                    {
                        provide: FileUploader,
                        useValue: new FileUploader({})
                    },
                    Constants, FileService, RegisteredApplicationService, KeycloakService,
                    MockBackend, BaseRequestOptions,
                    {
                        provide: Http,
                        useFactory: (backend: ConnectionBackend, defaultOptions: BaseRequestOptions) => {
                            return new Http(backend, defaultOptions);
                        },
                        deps: [MockBackend, BaseRequestOptions]
                    }
                ]
            }
        );

        TestBed.compileComponents().catch(error => console.error(error));
    });

    it('register app call', async(inject([RegisteredApplicationService], (service:RegisteredApplicationService) => {
        let inputPath = "src/main/java/";
        return service.registerByPath(0, inputPath).toPromise()
            .then(application => {
                console.log("Registered application: " + application.inputFilename);
                expect(application.inputFilename).toEqual("java");
            }, error => {
                expect(false).toBeTruthy("Service call failed due to: " + error);
            });
    })));
});
