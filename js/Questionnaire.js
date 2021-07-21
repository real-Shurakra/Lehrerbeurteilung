// Klasse Questionnaire

export default class Questionnaire
{
	constructor(questionnaire, questionnaireList)
	{
		// console.log("Aufruf von Klasse Questionnaire:");
		// console.log(questionnaire);

		this.menuBarColor;
		this.unhighlightedColor = "#9eb3c7";
		this.id;
		this.className;
		this.subject;
		this.amountStudents;
		this.questions;
		this.currentStatus;
		this.date;
		this.state = false;


		let div = document.getElementById(questionnaire.id);
		if (div !== null) div.remove();
		else
		{
			div = document.createElement("div");
			div.style.borderStyle = "solid";
			div.style.borderColor = this.unhighlightedColor;
			div.style.borderWidth = "1px";
			div.style.width = "99%";
			div.id = questionnaire.id;
			
	
			let tds = div.getElementsByClassName("questionnaireHeader");
			div.addEventListener("mouseenter", ()=>{
				div.style.cursor = "pointer";
				for(let td in tds)
				{
					if (tds[td].style != undefined)
					{
						tds[td].style.color = "#ffffff";
						tds[td].style.backgroundColor = this.menuBarColor;
						
					}
				}
			});
			div.addEventListener("mouseleave", ()=>{
				if (!this.state)
				{
					for(let td in tds)
					{
						if (tds[td].style != undefined)
						{
							tds[td].style.color = this.menuBarColor;
							tds[td].style.backgroundColor = this.unhighlightedColor;
						}
					}
					div.style.borderColor = this.unhighlightedColor;
				}
			});
			div.addEventListener("click", ()=>{
				if (!this.state) this.state = true;
				else this.state = false;

				if (this.state)
				{
					this.ShowQuestions(div.id);
					for(let td in tds)
					{
						if (tds[td].style != undefined)
						{
							tds[td].style.color = "#ffffff";
							tds[td].style.backgroundColor = this.menuBarColor;
							
						}
					}
				}
				else
				{
					this.HideQuestions(div.id);
					for(let td in tds)
					{
						if (tds[td].style != undefined)
						{
							tds[td].style.color = this.menuBarColor;
							tds[td].style.backgroundColor = this.unhighlightedColor;
						}
					}
					div.style.borderColor = this.unhighlightedColor;
				}
			});
			
			let table = document.createElement("table");
			table.style.borderCollapse = "collapse";
			table.style.tableLayout = "fixed";
			table.style.width = "100%";
	
			let rowHeaders = document.createElement("tr");
			let rowData = document.createElement("tr");
	
			// Dokument-Symbol hinzufügen
			let columnSymbol = document.createElement("td");
			columnSymbol.className = "questionnaireHeader";
			columnSymbol.rowSpan = 2;
			columnSymbol.style.width = "50px";
			columnSymbol.style.fontSize = "40px";
			columnSymbol.style.textAlign = "center";
			columnSymbol.style.color = this.menuBarColor;
			columnSymbol.innerHTML = " &#128462;"; // 🗎-Zeichen
			columnSymbol.style.backgroundColor = this.unhighlightedColor;
	
			rowHeaders.append(columnSymbol);
			for (let index in questionnaire)
			{
				//console.log(response[questionnaire][index]);
				let columnHeaders = document.createElement("td");
				columnHeaders.className = "questionnaireHeader";
	
				// Änderung der Header-Bezeichnungen
				if (index == "name") columnHeaders.innerHTML = "Thema";
				else if (index == "zeitstempel") columnHeaders.innerHTML = "Datum";
				else if (index == "id") continue;
				else if (index == "anzfragen") continue;
				else if (index == "schueleranzahl") continue;
				else if (index == "klassenname") columnHeaders.innerHTML = "Klasse";
				else if (index == "fach") columnHeaders.innerHTML = "Fach";
				else if (index == "bewertungsumme") columnHeaders.innerHTML = "Punkte";
				else columnHeaders.innerHTML = index;
	
				columnHeaders.style.backgroundColor = this.unhighlightedColor;
				columnHeaders.style.fontWeight = "bold";
				columnHeaders.style.fontSize = "small";
				columnHeaders.style.color = this.menuBarColor;
				rowHeaders.appendChild(columnHeaders);
					
				let columnData = document.createElement("td");
	
				if (index == "zeitstempel")
				{
					let timestamp = questionnaire[index].split(" ");
					columnData.innerHTML = timestamp[0];
				}
				else columnData.innerHTML = questionnaire[index];
	
				rowData.appendChild(columnData);			
			}
	
			// Bogenstatus Header hinzufügen
			let columnStatusHeader = document.createElement("td");
			columnStatusHeader.className = "questionnaireHeader";
			columnStatusHeader.style.color = this.menuBarColor;
			columnStatusHeader.style.fontWeight = "bold";
			columnStatusHeader.style.fontSize = "small";
			columnStatusHeader.innerHTML = "Status";
			columnStatusHeader.style.backgroundColor = "#9eb3c7";
			rowHeaders.appendChild(columnStatusHeader);
	
			// Bogenstatus hinzufügen
			let columnStatus = document.createElement("td");
			columnStatus.style.fontWeight = "bold";
			
			// Asynchroner Request
			let xhttp = new XMLHttpRequest()
			let path = "./php/main.php?mode=getCodes";

			let formDataCodes = new FormData();
			formDataCodes.append("fbId", questionnaire.id);

			xhttp.onreadystatechange = ()=>{
				if ( xhttp.readyState == 4 && xhttp.status == 200 )
				{
					questionnaireList.appendChild(document.createElement("br"));
					var responseQuestionnaireCodes = xhttp.responseText;

					let codesArray = responseQuestionnaireCodes.split("},");
	
					if (codesArray != null && codesArray.length > 1)
					{
						columnStatus.innerHTML = "offen";
						columnStatus.style.color = "#feb460"; // orange
					}
					else
					{
						columnStatus.innerHTML = "abgeschlossen";
						columnStatus.style.color = "green";	
					}

					rowData.appendChild(columnStatus);
			
					table.appendChild(rowHeaders);
					table.appendChild(rowData);
					div.appendChild(table);

					let questionContainer = document.createElement("div");
					questionContainer.id = div.id + "_question_container";
					questionContainer.style.width = "99%";
					questionContainer.style.margin = "auto";
					
					div.appendChild(questionContainer);
					
					questionnaireList.appendChild(div);
					
					
				}
			};
			xhttp.open("POST", path, true);
			xhttp.send(formDataCodes);
		}
	}

	Request(path, formData) // Synchroner Request wird nicht mehr genutzt
	{
		let response;
		let xhttp = new XMLHttpRequest();
		xhttp.open("POST", path, false);
		xhttp.send(formData);
		response = xhttp.responseText;

		//if (response.indexOf("{") != 0) return response;
		//if (response.length > 100 && response != null) return JSON.parse(response);
		return response;
	}

	HideQuestions(questionnaireId)
	{
		let tempQuestionnaire = document.getElementById(questionnaireId);
		tempQuestionnaire.style.borderColor = this.unhighlightedColor;
		document.getElementById(questionnaireId + "_question_container").innerHTML = "";
	}

	ShowQuestions(questionnaireId)
	{
		let xhttp = new XMLHttpRequest()
		let path = "./php/main.php?mode=getFbFragen";

		let formData = new FormData();
		formData.append("fbId", questionnaireId);

		document.getElementById(questionnaireId).style.borderColor = this.menuBarColor;

		xhttp.onreadystatechange = ()=>{
			if ( xhttp.readyState == 4 && xhttp.status == 200 )
			{
				let response = JSON.parse(xhttp.responseText);

				for(let i = 0; i < response.returnvalue.length; i++)
				{
					// Kategorie-Header hinzufügen, Zusammengesetzte Id aus Fragebogen-Id und Kategorie-Id
					let tempCategoryId = "expanded_questionnaire_" + questionnaireId + "_category_" + response.returnvalue[i][0].fragekategorie;
					let tempCategory = document.getElementById(tempCategoryId);
					//console.log(tempCategory);
					if (tempCategory == undefined) 
					{
						let tempCategoryBeforeSpacer = document.createElement("div");
						tempCategoryBeforeSpacer.style.height = "5px";
						tempCategoryBeforeSpacer.style.backgroundColor = "white";
						document.getElementById(questionnaireId + "_question_container").appendChild(tempCategoryBeforeSpacer)


						tempCategory = document.createElement("div");
						tempCategory.id = tempCategoryId;
						tempCategory.style.backgroundColor = this.menuBarColor;
						tempCategory.style.color = "white";
						tempCategory.style.fontSize = "16px";
						//tempCategory.style.height = "12px";
						tempCategory.innerHTML = response.returnvalue[i][0].fragekategorie;
						//document.getElementById(questionnaireId).appendChild(tempCategory);

						let tempCategoryAfterSpacer = document.createElement("div");
						tempCategoryAfterSpacer.style.height = "5px";
						tempCategoryAfterSpacer.style.backgroundColor = "white";
						tempCategory.appendChild(tempCategoryAfterSpacer);
					}
					// Frage hinzufügen
					let tempQuestion = document.createElement("div");
					tempQuestion.style.backgroundColor = "white";
					tempQuestion.style.color = "black";
					tempQuestion.style.fontSize = "16px";
					tempQuestion.style.height = "22px";
					// Zusammengesetzte Id aus Fragebogen-Id und Frage-Id
					tempQuestion.id = "expanded_questionnaire_" + questionnaireId + "_question_" + response.returnvalue[i].frageid;
					tempQuestion.innerHTML = response.returnvalue[i][0].fragestring;
					tempCategory.appendChild(tempQuestion);
					
					document.getElementById(questionnaireId + "_question_container").appendChild(tempCategory);
				}
			}
		};
		xhttp.open("POST", path, true);
		xhttp.send(formData);
	}

}