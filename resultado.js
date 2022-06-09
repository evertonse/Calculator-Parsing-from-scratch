/* Logica para manipulação da expressão começa aqui  */
const calcularResultado = (input) => {
	/* Aqui vem seu codigo maniplando {input} até que possa ser retornado dessa função como resultado*/
	/* coding.... */
	/* pode ser no console oq foi digitar e conferir */
	const solução = calcFromInput(input);
	if (typeof solução !== "number") return "Inválido";
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
	const bool = string.match(/([*()/\-+√^]){1}/);
	return bool;
};

/* Insere um item dentro do array na posição pos, e retorn uma nova lista com o novo item adicionado */
const insert = (array) => (pos) => (item) => {
	const lista = [...array];
	return [...lista.slice(0, pos), item, ...lista.slice(pos)];
};
/* ############FUNCTIONS##################### */

/* Ordena por Parentesis */
const calcExp = (parsedExp) => {
	//#Com Recursão
	/* inner equivale a expressão dentro do parentesis mais interno */
	const inner = innerExp(parsedExp);
	/* Se a parsedExp não for válida, retornando inválido */
	if (!isValidParsedExp(inner.Exp)) {
		return "inválido";
	}
	/* Se não houver parensetesis apenas avaliamos a expressão
	utilizando evalExp */
	if (!inner.par) {
		return evalExp(inner.Exp);
		/* Se houver parentesis então separamos apenas avaliamos a expressão de dentro do paresentesis
		quando for resolvida, "colamos" de volta o resto da operação*/
	} else {
		/* Reparamos as duas partes da expressão sem contar com a parte de dentro (inner.Exp) */
		const [head, tail] = [
			parsedExp.slice(0, inner.start),
			parsedExp.slice(inner.end),
		];
		/* Calculamos o resultado de expressão interna */
		const result = evalExp(inner.Exp);
		// Agora newExp equivale a o resultado da
		// expressão interna mais as duas partes fora do parentesis
		const newExp = [...head, result, ...tail];
		/* Chamamos calcExP com a nova expressão até que não tenha mais nada pra calcular */
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
	/* Premaramos um função de splitar de uma maneira expecifica e 
	Pre-carregamos com a nossa lista que corresponda a expressão */
	const split = split_list(exp);
	const order = [
		["^", "√"],
		["*", "/"],
		["+", "-"],
	];
	/* Criação da nova expressão que seja adicionado */
	let newExp = [];
	let found = false;
	/* Ordem de avaliação { ^ √    depois->   * /   depois->   + - } nessa ordem */
	const cb = (symbol, ele, index) => {
		if (found) {
			return false;
		}
		if (symbol.includes(ele)) {
			found = true;
			/* Op = operação que consiste em uma lista:
			primeiro numero + operador + segundo numero */
			/* head e tail é o resto expressão que não foi avaliada ainda */
			const [head, op, tail] = split(index - 1, index + 2);
			/* Separamos op em suas partes */
			const [num1, operador, num2] = op;
			const result = operate(operador, num1, num2);
			newExp = [...head, result, ...tail];
			console.log(newExp);
		}
	};
	order.map((symbol) => {
		/* Na ordem da lista {ordem} vamos chamar a função  */
		const cbSymbol = cb.bind(null, symbol);
		exp.map(cbSymbol);
	});

	return evalExp(newExp);
};

/* Função parseMathExp para pegar cada parte da expressão e juntas em uma lista
tal lista contém apenas numeros e operadores na ordem de digitação */
const parseMathExp = (expression) => {
	//#Sem Recursão
	const operation = [];
	let numero = "";
	expression.split("").map((token) => {
		if (isNumber(token)) {
			numero += token;
		} else if (isOperator(token)) {
			if (numero !== "") {
				operation.push(parseFloat(numero));
			}
			if (token == "-") {
				/* Aqui testamos se o token é negativo, se 
			for simplesmentes trataremos o numero como negativo e o operador como +
			que será o mesmo resultado, porém dara melhores resultado com operações com numeros negativos*/

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
	const leftPar = exp.indexOf(")");
	const rightPar = exp.slice(0, leftPar).lastIndexOf("(");

	if (leftPar == -1 || rightPar == -1) {
		/* caso n ache parenteses retorn Exp:exp a expressão intacta */
		/* Mais aviso de em forma de par: false, que não foi encontrado parentesis */
		return {
			Exp: exp,
			start: 0,
			end: -1,
			par: false,
		};
	} else {
		/* Se for encotnrado parentesis, retorna a expressão de dentro
		junto com par:true, que indica que parentesis foi encontrado
		mais start: de onde começou a expressão e end: onde terminou a expressão */
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
	/* Sanitizamos a expressãoo, mais explicações na função */
	const cleanExp = sanitize(raw);
	const validation = isValidExp(cleanExp);
	if (validation.valid) {
		/* removemos o icone de erro se for válido */
		errorDisplay.classList.remove("active");
		/* e calculamos a expressão */
		return calcExp(parseMathExp(sanitize(raw)));
	} else {
		/* Error Handleling, caso encontre e identifique o erro,
		 é posto num icone com informações sobre erro e retorna "inválido" */
		errorDisplay.classList.add("active");
		/* Simples display de error aqui */
		errorDisplay.setAttribute("data-value", validation.errors.join("\r\n"));
		console.log(validation.errors);
		return "inválido";
	}
};
