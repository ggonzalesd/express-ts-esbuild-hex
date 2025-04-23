import 'reflect-metadata';
import { container } from 'tsyringe';

import { BootstrapApplication } from '@@app/bootstrap';

import '@@app/server.service';
import '@@app/rest.service';

import '@@infra/router/Express.adapter';

const bootstrap = container.resolve<BootstrapApplication>(BootstrapApplication);

bootstrap.start();
