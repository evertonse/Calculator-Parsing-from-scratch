(function () {
	/* ###### - Fields -####### */

	const input = document.querySelector("[data-input]");
	const buttons = document.querySelectorAll("[data-button]");
	const resultado = document.querySelector("[data-resultado-display]");
	const apagar = document.querySelector("[data-button-apagar]");
	const limpar = document.querySelector("[data-button-limpar]");
	const raiz = document.querySelector("[data-button-raiz]");
	const exponencial = document.querySelector("[data-button-exponencial]");
	const buttonResultado = document.querySelector("[data-button-resultado]");

	/* ###### - DECLARATIVE -####### */

	/* Atulizar o input, ouseja a area de texto (<textarea/>) */
	const updateInput = (newValue, type = "a", position) => {
		/* O parametro {position} diz a respeito da posição que deseja que dê foco contando a partir de onde está a seleção na area de texto */
		position =
			parseInt(position) + parseInt(input.selectionStart) ||
			parseInt(input.selectionStart);
		end = parseInt(input.selectionEnd);
		/* 
    if type==a apend
    if type == s sobrescrever 
    if type == r remove texto selecionado */
		switch (type) {
			case "a":
				input.value =
					input.value.slice(0, position) +
					newValue +
					input.value.slice(position);
				input.focus({ preventScroll: true });
				input.setSelectionRange(position + 1, position + 1);
				return input.value;

			case "s":
				input.value = newValue;
				input.focus({ preventScroll: true });
				return input.value;

			case "r":
				if (position !== end) {
					/* Caso haja seleção de texto */
					input.value = input.value.slice(0, position) + input.value.slice(end);
					input.focus({ preventScroll: true });
					input.setSelectionRange(position, position);
					return input.value;
				} else if (position <= 0) {
					/* Quando está no começo do texto */
					input.value = input.value.slice(1);
					input.focus({ preventScroll: true });
					input.setSelectionRange(position, position);
					return input.value;
				} else if (position === end) {
					/* Sem seleção de texto apenas  */
					input.value =
						input.value.slice(0, position - 1) + input.value.slice(position);
					input.focus({ preventScroll: true });
					input.setSelectionRange(position - 1, position - 1);
					return input.value;
				}

			default:
				break;
		}
	};
	/* Generic Utiliarios */
	/* Adiciona mais de um eventListener ao mesmo tempo */
	const addEventListenerAll = (events) => (element) => (fn) => {
		console.log(events);
		events.split(" ").forEach((e) => {
			element.addEventListener(e, fn);
		});
	};

	/* Specific Utiliarios */
	const preventRepeat =
		(inputElement) =>
		(...sanitizerCBs) => {
			addEventListenerAll("input")(inputElement)((e) => {
				sanitizerCBs.forEach((sanitizer, index) => {
					const string = e.target.value;
					e.target.value = sanitizer(string);
				});
			});
		};

	const sanitizeDecimal = (string) => {
		let result = string;
		return removeExtraDecimal(result);
	};
	const sanitizeOperator = (string) => {
		let result = string;
		return removeExtraOperator(result);
	};
	const sanitizeLetters = (string) => {
		let result = string;
		return removeLetters(result);
	};

	/* Função para adicionar um evento de click e dando update na area de texto */
	const addClick = (button, string, position = 0, type = "a") => {
		button.addEventListener("click", (e) => {
			e.preventDefault();
			updateInput(string, type, parseInt(position));
			triggerEvent(input, "input");
		});
	};

	/* ###### - IMPERATIVE -####### */
	/* Adicionando evento para cara botão */
	addClick(exponencial, "(y**x)", 6);
	addClick(raiz, "(x√y)", 6);
	addClick(apagar, "", 0, "r");
	addClick(limpar, "", 0, "s");
	buttons.forEach((button) => {
		addClick(button, button.getAttribute("data-button"), "a");
	});

	/* Fazer o botão resultado mostrar o resultado */
	buttonResultado.addEventListener("click", (e) => {
		e.preventDefault();
		resultadoFinal = calcularResultado(input.value);
		let cor = "#208865"; //Green
		if (resultadoFinal === "Inválido") cor = "#aa3030"; //Red
		resultado.innerHTML =
			"Resultado: " + `<big style="color:${cor};">${resultadoFinal}</big>`;
		updateInput(input.value, "s");
	});

	/* Prevenir repetição de certo caracteres */
	preventRepeat(input)(sanitizeOperator, sanitizeDecimal, sanitizeLetters);
	/* STARTS Quando clickar ENTER em qualquer lugar da tela, mostra o resultado */
	document.body.addEventListener("keypress", (e) => {
		if (e.key.toUpperCase() === "ENTER") {
			e.preventDefault();
			input.focus();
			buttonResultado.click(0);
		}
	});
})(calcularResultado);
