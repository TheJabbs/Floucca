import {WebSocketGateway, WebSocketServer} from "@nestjs/websockets";
import { Server } from 'socket.io';
import {FormGatewayInterface} from "./interface/formGateway.interface";
import {Injectable} from "@nestjs/common";

@Injectable()
@WebSocketGateway()
export class FormGateway {
    @WebSocketServer()
    server: Server;

    notifyNewForm(formId: FormGatewayInterface) {
        this.server.emit('newForm', formId);
    }
}
