const compose =
	(...fns) =>
	(valor) =>
		fns.reduce((acc, fn) => fn(acc), valor);
/* Apenas conta quantos vezes aparece um char dentro de um array, 
e considerador tbm dentro do elementos do array */
Array.prototype.count = function (char) {
	let string = this.join();
	let times = 0;
	string.split("").forEach((ele) => {
		if (ele == char) {
			times += 1;
		}
	});
	return times;
};
/* Força Um Evento Acontecer */
const triggerEvent = (el, type) => {
	if ("createEvent" in document) {
		var e = document.createEvent("HTMLEvents");
		e.initEvent(type, false, true);
		el.dispatchEvent(e);
	} else {
		// IE8
		var e = document.createEventObject();
		e.eventType = type;
		el.fireEvent("on" + e.eventType, e);
	}
};
/* Split an array into  args.lenght + 1 parts */
const split_list =
	(lista) =>
	(...args) => {
		/* Cada uma dos argumentos depois de lista serve como cortes no array, onde será separado */
		let [previous, parts] = [0, []];

		args.forEach((ele) => {
			parts.push(lista.slice(previous, ele));
			previous = ele;
		});
		/* depois de feito o ultimo corte retornamos uma lista que contém as partes da lista orignal */
		return [...parts, ...[lista.slice(previous, args[-1])]];
	};

const splitOnce =
	(string) =>
	(char, last = true) => {
		if (!string) {
			return "";
		}
		let i = 0;
		last ? (i = string.lastIndexOf(char)) : (i = string.indexOf(char));
		let splits = [string.slice(0, i + 1), string.slice(i + 1)];
		i == -1 ? (splits = [string, ""]) : "";
		return splits;
	};

/* Remove Operadores que estão colados */
const removeExtraOperator = (string) => {
	/* Se nenhuma string for dada retorna string vazia */
	if (!string) {
		return "";
	}
	/* Copia da string para manter a string originial intacta,
	OBS: percebi deposi que js sempre passa por value string, então 
	desconsidere sempre que ver isso */
	let word = string.slice(0);
	/* Se der match em qualquer um desses simbolos \-+√^ com 2 ou mais 
		será substituido por apenas 1,
		de o simbolo for "*" então só ira mudar se for mais de 3 simbolos para presenvar potenciação*/
	let matches = word.match(/([/\-+√^]){2,}|[*]{3,}/g);
	if (matches) {
		matches.forEach((match) => {
			if (match.match(/[*]{3,}/g)) {
				word = word.replace(match, "**");
			}
			word = word.replace(match, match[0]);
		});
	}

	return word;
};

/* Removes letras que não sejam xy */
const removeLetters = (string) => {
	if (!string) {
		return "";
	}
	/* replace n  ocurrencer with 1 */
	let word = string.slice(0);
	/* Se der match em qualquer um desses simbolos \-+√^ com 2 ou mais 
		será substituido por apenas 1,
		de o simbolo for "*" então só ira mudar se for mais de 3 simbolos para presenvar potenciação*/
	let matches = word.match(/([^\dxy*\[\]\(\)\/\-.,+√^]{0,})/g);
	if (matches) {
		matches.forEach((match) => {
			word = word.replace(match, "");
		});
	}

	return word;
};

/* Adicina multiplicação a uma expresão que tenha 
uma mutiplicação implicita por uma parenseteses direito ou esquerdo
Ex: 2(2) = 2*(2)  */
const changePar = (char) => (string) => {
	if (!string) {
		return "";
	}
	let par = char;
	let word = string.slice(0);
	let matches = null;
	/* Tentando encontrar parentesis colado com numero e transformar em uma multiplicação */
	if (par == "(") matches = word?.match(/([\d]+[\(]+[\d]+)/g);
	else if (par == ")") matches = word?.match(/([\d]+[\)]+[\d]+)/g);
	/* Aqui só muda que se for par direito então os matches é outro */

	if (matches == null || matches == undefined) {
		return word;
	}
	matches?.forEach((match) => {
		/* Pegamos o numero que encontramos */
		let [num1, num2, ...rest1] = match?.match(/[\d]+/g);
		/* incializamos os parentesis que pode ser esquerdos ou direitos */
		let [pars, ...rest] = [];

		let replace = num1 + `*${pars}` + num2;
		/* Se for direito transformamos (2)2 em (2)*2 */
		if (par == ")") {
			[pars, ...rest] = match.match(/\)+/g);
			replace = num1 + `${pars}*` + num2;
		}
		/* Se for esquerdo transformamos 2(2) em 2*(2) */
		if (par == "(") {
			[pars, ...rest] = match?.match(/\(+/g);
			replace = num1 + `*${pars}` + num2;
		}
		console.log("replace: ", replace);
		/* Façamos a troca da match encontrada */
		word = word.replace(match, replace);
	});
	// Retornamos até que não haja mais parentesis tocando com numeros sem ter um operador entre eles
	return changePar(char)(word);
};
const changeParRight = changePar(")");
const changeParLeft = changePar("(");

/* Muda quando há parenteses colados 
Change when ")("  to "")*("    */
const changeDoublePar = (string) => {
	if (!string) {
		return "";
	}
	/* replace n  ocurrencer with 1 */
	let word = string.slice(0);
	let matches = word.match(/(\)+\(+)/g);
	if (matches == null) {
		return word;
	}
	matches.forEach((match) => {
		let leftpars = match.match(/[\)]+/);
		let rightpars = match.match(/[\(]+/);
		console.log(word);
		word = word.replace(match, `${leftpars}*${rightpars}`);
	});
	return changeDoublePar(word);
};

/* # Remove Extra Decimals in a string*/
const removeExtraDecimal = (string) => {
	if (!string) {
		return "";
	}
	/* replace n  ocurrencer with 1 */
	let word = string.slice(0);
	let matches = word.match(/([\.,]+\d{0,}[\.,]+)/g);

	if (matches == null) {
		console.log(word);
		return word;
	}

	matches.map((match) => {
		const num = match.match(/([\d])+/g);
		console.log(num);
		if (num) {
			word = word.replace(match, "." + num);
		} else {
			word = word.replace(match, ".");
		}
	});
	/* chama ela demovo até que não tenha mais decimais na string */
	return removeExtraDecimal(word);
};
const changeCochetes = (string) => {
	if (!string) {
		return "";
	}
	let word = string.slice(0);
	word = word.replace(/([\[]){1}/g, "(");
	word = word.replace(/([\]]){1}/g, ")");
	/* Troca chocetes por paresentesis para facilitar, 
	ja eles que tem a mesma função sintatica */
	return word;
};

/*  changeStartWithOperation:
 Caso começe com uma operador retiramos ele
mas caso seja negativo - retornamos (0 - string)

o que, essencialmente é o mesmo que -2, porém forçamos ter 
dois numeros entre cada operador sempre,mesmo que o usuario n veja */
const changeStartWithOperation = (string) => {
	if (!string) {
		return "";
	}
	let word = string.slice(0).trim();
	if (word[0] == "+" || word[0] == "* " || word[0] == "/") {
		word = word.slice(1);
	}
	if (word[0] == "-") word = "0" + word;
	return word;
};

/* Impede virugla de ser digitada duas vezes, há não se que seja outro numero já */
const changeVirgulaToPoint = (string) => {
	if (!string) {
		return "";
	}
	let word = string.slice(0).trim();
	word = word.replace(/([\,]){1}/g, ".");
	return word;
};

/* Troca simbolo potenciação de ** para ^  */
const changePonteciação = (string) => {
	if (!string) {
		return "";
	}
	let word = string.slice(0);
	word = word.replace(/([**]){2}/g, "^");

	return word;
};
/* Transformar sinais "+" ou "-" com numeros sem o par dentro */
const removeSingleOperation = (string) => {
	if (!string) {
		return "";
	}
	/* mesma logica do outro, queremos forçar um operador entre dois numeros, sempre. */
	/* replace (+number) with (number)   with 1 or more ocurrences */
	let word = string.slice(0);
	let matches = word.match(/([^\d)]{1}[+-]+\d+)/g);
	if (matches == null) {
		return word;
	}
	matches.forEach((match) => {
		let [simbolo, sinal, numero] = [match[0], match[1], ...match.slice(2)];
		word = word.replace(match, simbolo + "(0" + sinal + numero + ")");
	});
	return removeSingleOperation(word);
};

/* caso √ apareça sem o indice, indice 2 é dado, formando a raiz quadrada 
	EX:√3  - >  2√3  ; OBS: Caso haja parensetese dentro da expressão de radiciação 
	Esse função a desconsidera, #NoPar# #Com Recursão#
	*/
const createDefaultRadiciaçãoNoPar = (string) => {
	if (!string) {
		return "";
	}
	let word = string.slice(0);

	let matches = word.match(/([^\d)]{1}[√]{1})|(^[√])/g);
	if (matches == null) {
		return word;
	}
	matches?.map((match) => {
		const [simbolo, radicando] = splitOnce(match)("√");
		const replace = `${simbolo.slice(0, -1)}2√` + `${radicando}`;

		/* Se raiz é diferentes de √, então quer dizer que a raiz está no começo da string */

		word = word.replace(match, replace);
	});

	return createDefaultRadiciaçãoNoPar(word);
};

/* Testa se um expressão está valida ou não */
const isValidExp = (string) => {
	/* Tentando dar catch em error e dispobilizar para o uzuario 
	
	OBS: Dentro da string de cada if explica brevemente sobre oq é cada regex*/
	const validation = {
		errors: [],
		valid: false,
	};
	if (!string) {
		validation.valid = true;
		return validation;
	}
	let tokens = string.split("");

	if (string.match(/(\(\))+/g)) {
		validation.errors.push("Paresentis Vazios");
	}
	if (tokens.count("(") != tokens.count(")")) {
		validation.errors.push("Parentesis precisam ser fechados corretamente");
	}
	if (
		/* Aqui cobre os casos : (*^√) (*^√num) (num*^√) 2*^√ */
		string.match(
			/([^\d)]{0,}[*^√]{01,}[^\d(]{0,})$|([^\d)]{0,}[*^√]{01,}[^\d(]{1,})|([^\d)]{1,}[*^√]{01,}[^\d(]{0,})/g
		)
	) {
		validation.errors.push(
			"Operadores *^√ precisam ter dois numeros entre eles"
		);
	}
	if (string.match(/([+\-]{1,}[^\d([]]{0,})$|(([+\-]{1,}[^\d(]]{1,}))/gm)) {
		validation.errors.push("Voce precisa de algo após + ou - ");
	}
	if (string.match(/([^\d]+[.]{1}[^\d]+)|(^[.]{1}[^\d]+)|(\.$)/gm)) {
		validation.errors.push("Voce precisa de um numero após decimal . ou , ");
	}
	if (
		string.match(/([\-^√+]{0,}[*]+[+\-^√]{1,})|([\-^√+]{1,}[*]+[+\-^√]{0,})/gm)
	) {
		validation.errors.push(
			"Voce não pode ter operador após *,\r\n caso use -2*-2 subistitua por -2*(-2)"
		);
	}
	if (validation.errors.length == 0) {
		validation.valid = true;
	}
	/* No final retornamos o "boletim de ocorrencia" na através da const validation */
	return validation;
};

const isValidParsedExp = (parsedExp) => {
	/* Only to be used on innerExp
	Apenas use na expressão mais interna, pois essa função n considera parentesis */
	if (!parsedExp) {
		return false;
	}
	/* Contamos quantos operadors tem comparados com numeros para fazer a sequencia
	numer operador numero operador numero.
	Exp : 2  + 2 + 2
	Se  Tivermos mais operadores que numeros num expressão sem paresentesis,então algo está errado*/
	const counter = parsedExp?.reduce(
		(acc, token) => {
			if (!isNaN(token)) {
				acc.numbers += 1;
			} else if (token.match(/([*/\-+√^]){1}/)) {
				acc.operators += 1;
			}
			return acc;
		},
		{ operators: 0, numbers: 0 }
	);
	//Confirmamos a qntd de numero e operadores, devemos ter sempre 1 numero a mais que operador
	if (counter.operators + 1 !== counter.numbers) return false;
	else return true;
};

/* Composição de todos as sanitizações de um string para usar em expressões matematicas  */
const sanitizeExp = compose(
	changeStartWithOperation,
	changePonteciação,
	changeCochetes,
	createDefaultRadiciaçãoNoPar,
	changeVirgulaToPoint,
	removeSingleOperation,
	changeDoublePar,
	changeParLeft,
	changeParRight
);
