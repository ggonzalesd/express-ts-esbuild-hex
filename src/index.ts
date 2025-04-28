import 'reflect-metadata';
import { container } from 'tsyringe';

import { MainBootstrap } from '@@app/main';

import '@@infra/environment/dotenv.config';
import '@@infra/barrier/CustomBarrier.adapter';

import '@@infra/event/RedisEvent.adapter';
import '@@infra/database/psql/PsqlDataAccess';

import '@@infra/router/ExpressApp.adapter';
import '@@infra/router/ExpressRouter.adapter';

import '@@infra/router/ErrorHandler.factory';

import '@@infra/websocket/WsApp.adapter';

container.resolve<MainBootstrap>(MainBootstrap);
