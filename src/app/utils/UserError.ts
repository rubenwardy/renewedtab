import { MyMessageDescriptor } from "app/locale/MyMessageDescriptor";

export default class UserError extends Error {
	readonly messageDescriptor?: MyMessageDescriptor = undefined;

	constructor(message: (string | MyMessageDescriptor)) {
		super((message as any).defaultMessage ? (message as any).defaultMessage : message.toString());
		this.name = "UserError";

		if ((message as any).defaultMessage) {
			this.messageDescriptor = message as MyMessageDescriptor
		}
	}
}
