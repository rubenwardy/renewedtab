import { MessageDescriptor } from "@formatjs/intl";

export default class UserError extends Error {
	readonly messageDescriptor?: MessageDescriptor = undefined;

	constructor(message: (string | MessageDescriptor)) {
		super((message as any).defaultMessage ? (message as any).defaultMessage : message.toString());
		this.name = "UserError";

		if ((message as any).defaultMessage) {
			const md = message as MessageDescriptor;
			this.messageDescriptor = md;
		}
	}
}
