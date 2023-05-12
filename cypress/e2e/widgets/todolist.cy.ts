import { Widget } from "../../support/components/Widget";

describe("TodoList", () => {
	beforeEach(() => {
		cy.visit("/dist/webext/app/index.html");
		cy.selectPreset("focus");
		cy.createWidget("TodoList");
	});

	it("add and remove items", () => {
		const widget = new Widget(3);
		widget.get(".todolist li").should("have.length", 1);

		cy.get("[name='todo-new-item']").type("Adopt a cat\n");
		widget.get(".todolist li").should("have.length", 2);

		cy.get("[name='todo-new-item']").type("Do the thing\n");
		widget.get(".todolist li").should("have.length", 3);

		cy.get("[name='todo-new-item']").type("Do another thing\n");
		widget.get(".todolist li").should("have.length", 4);

		widget.get(".todolist li:first-child input[type='checkbox']").check();
		widget.get(".todolist li:first-child [data-cf='todo-delete']").click();
		widget.get(".todolist li").should("have.length", 3);
	});
});
