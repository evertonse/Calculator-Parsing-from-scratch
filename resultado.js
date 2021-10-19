/* Logica para manipulação da expressão começa aqui  */
const calcularResultado = (input) => {
	/* Aqui vem seu codigo maniplando {input} até que possa ser retornado dessa função como resultado*/
	/* coding.... */
	/* pode ser no console oq foi digitar e conferir */
	let solução = calcFromInput(input);
	if (typeof solução !== "number") solução = "Inválido";
	/* O return {resultadoFinal} é oq ira aparecer como resultado na tela da calculadora */
	return solução;
};

/* ############FUNCTIONS##################### */

/* Split an array into  args.lenght + 1 parts */

/* Test if a string is a number */
const isNumber = (string) => {
	return string.match(/[0-9.]/);
};
/* Test if a string is a operator */
const isOperator = (string) => {
	let bool = string.match(/([*()/\-+√^]){1}/);
	return bool;
};

/* Insere um item dentro do array na posição pos, e retorn uma nova lista com o novo item adicionado */
const insert = (array) => (pos) => (item) => {
	lista = [...array];
	return [...lista.slice(0, pos), item, ...lista.slice(pos)];
};
/* ############FUNCTIONS##################### */

/* Ordena por Parentesis */
const calcExp = (parsedExp) => {
	//#Com Recursão
	let inner = innerExp(parsedExp);
	/* Se a parsedExp não for válida, retornando inválido */
	console.log(inner.Exp);
	if (!isValidParsedExp(inner.Exp)) {
		console.log("isValidParsedExp deu false", inner);
		return "inválido";
	}
	console.log(inner);
	/* Se não houver parensetesis apenas avaliamos a expressão
	utilizando evalExp */
	if (!inner.par) {
		console.log(inner.Exp);
		return evalExp(inner.Exp);
		/* Se houver parentesis então separamos apenas avaliamos a expressão de dentro do paresentesis
		quando for resolvida, "colamos" de volta o resto da operação*/
	} else {
		console.log(parsedExp);
		const [head, tail] = [
			parsedExp.slice(0, inner.start),
			parsedExp.slice(inner.end),
		];
		console.log(inner.Exp);
		const result = evalExp(inner.Exp);

		console.log(head);
		console.log(result);
		console.log(tail);
		const newExp = [...head, result, ...tail];
		console.log(newExp);
		return calcExp(newExp);
	}
};

/* Avalia o resultado de uma parsed expression sem parentesis seguindo uma ordem de operadores 
retornando o seu resultado. */
const evalExp = (exp) => {
	//#Com Recursão
	if (exp?.length <= 2) {
		return exp[0];
	}
	if (!isValidParsedExp(exp)) {
		return "inválido";
	}
	console.log("Entramos em evalExp");
	const split = split_list(exp);
	const order = [
		["^", "√"],
		["*", "/"],
		["+", "-"],
	];
	let newExp = [];
	let found = false;
	/* Ordem de avaliação { ^ √    depois->   * /   depois->   + - } nessa ordem */
	const cb = (symbol, ele, index) => {
		if (found) {
			return false;
		}
		console.log(ele);
		if (symbol.includes(ele)) {
			found = true;
			const [head, op, tail] = split(index - 1, index + 2);
			const [num1, operador, num2] = op;
			const result = operate(operador, num1, num2);
			newExp = [...head, result, ...tail];
			console.log(newExp);
		}
	};
	console.log(exp);
	order.forEach((symbol) => {
		const cbSymbol = cb.bind(null, symbol);
		exp.forEach(cbSymbol);
	});

	console.log(newExp);

	return evalExp(newExp);
};
/* Função parseMathExp para pegar cada parte da expressão e juntas em uma lista
tal lista contém apenas numeros e operadores na ordem de digitação */
const parseMathExp = (expression) => {
	//#Sem Recursão
	let operation = [];
	let numero = "";
	expression.split("").forEach((token) => {
		console.log(token);
		console.log(numero);
		if (isNumber(token)) {
			numero += token;
			console.log(numero);
		} else if (isOperator(token)) {
			if (numero !== "") {
				operation.push(parseFloat(numero));
			}
			if (token == "-") {
				token = "+";
				numero = "-";
			} else {
				numero = "";
			}
			operation.push(token);
		}
	});

	/* O ultimo número que sobrou é adicionado se não for uma string vazia */
	isNumber(numero) ? operation.push(parseFloat(numero)) : "";

	return operation;
};

/* create generic operation beatween two numbers */ //#Sem Recursão
const operate = (operador, number1, number2) => {
	switch (operador) {
		case "+":
			return number1 + number2;
		case "-":
			return number1 - number2;
		case "/":
			return number1 / number2;
		case "*":
			return number1 * number2;
		case "^":
			return number1 ** number2;
		case "√":
			return Math.pow(number2, 1 / number1);

		default:
			console.log("I'm in default operate");
			return number1;
	}
};

const innerExp = (exp) => {
	/* retorna a expressão mais interna da expressão maior */
	//#Sem Recursão
	/* retuns par:false caso n haja abertura ou fechamento  de parenteses */
	let leftPar = exp.indexOf(")");
	console.log(leftPar);
	let rightPar = exp.slice(0, leftPar).lastIndexOf("(");
	console.log(rightPar);

	if (leftPar == -1 || rightPar == -1) {
		/* caso n ache parenteses retorn Exp:exp a expressão intacta */
		return {
			Exp: exp,
			start: 0,
			end: -1,
			par: false,
		};
	} else {
		console.log(exp);
		return {
			Exp: exp.slice(rightPar + 1, leftPar),
			start: rightPar,
			end: leftPar + 1,
			par: true,
		};
	}
};
const sanitize = sanitizeExp;

/* Calcular A Expressão em sí */

const calcFromInput = (raw) => {
	const errorDisplay = document.querySelector(".error");

	const cleanExp = sanitize(raw);
	const validation = isValidExp(cleanExp);
	if (validation.valid) {
		errorDisplay.classList.remove("active");
		console.log("It's a valid Expression as string");
		return calcExp(parseMathExp(sanitize(raw)));
	} else {
		errorDisplay.classList.add("active");
		errorDisplay.setAttribute("data-value", validation.errors.join("\r\n"));
		console.log(validation.errors);
		return "inválido";
	}
};
