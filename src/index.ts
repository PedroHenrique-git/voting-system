import Option from "./classes/options";
import VotingApp from "./classes/votingApp";
import Votation from "./classes/votation";

// variables
const form = document.querySelector("form") as HTMLFormElement;
const addOptionBtn = document.querySelector(".add-option") as HTMLLinkElement;
let id = 0;
let options: Option[] = [];

// functions

function createVoting(options: Option[]): void {
  const pollQuestion = document.querySelector("#poll") as HTMLInputElement;

  if (options.length > 0 && pollQuestion.value !== "") {
    try {
      const votation = new Votation(pollQuestion.value);
      options.forEach((option) => votation.addOption(option));
      const votingApp = new VotingApp();
      votingApp.addVotation(votation);
      addVotingInHtml(votingApp);
    } catch (e) {
      alert(e.message);
    }
  } else {
    return;
  }
}

function addOption(): void {
  id++;
  const optionName = form.querySelector("#option") as HTMLInputElement;
  const optionNumber = form.querySelector("#numberOption") as HTMLInputElement;
  options.push(new Option(optionName.value, Number(optionNumber.value)));

  const removeOption = (id: number): void => {
    const newOptions = options.filter((option) => option.getId() !== id);
    options = newOptions;
  };

  const element = document.createElement("span");
  element.innerHTML = `${optionName.value} - ${optionNumber.value}`;

  const removeBtn = document.createElement("button");
  removeBtn.classList.add("remove-option");
  removeBtn.innerText = "remove";

  element.appendChild(removeBtn);

  // not ideal
  removeBtn.addEventListener("click", function () {
    removeOption(id);
    this.parentElement?.remove();
  });

  addOptionBtn.parentElement?.insertAdjacentElement("afterend", element);
}

const addVotingInHtml = (votingApp: VotingApp): void => {
  const votingInHtml = votingApp.Votations.map((votation) => {
    const votationDiv = document.createElement("div");

    votationDiv.classList.add("votation-card");
    votationDiv.innerHTML = `<h2>${votation.PollQuestion}</h2>`;

    votation.Options.forEach((option) => {
      const optionDiv = document.createElement("div");
      optionDiv.classList.add("option");

      const p1 = document.createElement("p");
      p1.innerHTML = `<p>${option.Name}</p>`;

      const p2 = document.createElement("p");
      p2.innerHTML = `
        <p>
          Total votes: <span class="total-votes">${option.TotalNumberOfVotes}</span>
        </p>
      `;

      const btn = document.createElement("button");
      btn.innerText = "Vote";
      btn.classList.add("vote-button");

      // not ideal
      btn.addEventListener("click", () => {
        addVote(option.NumberToVote, votation, option);
      });

      optionDiv.appendChild(p1);
      optionDiv.appendChild(p2);
      optionDiv.appendChild(btn);

      votationDiv.appendChild(optionDiv);
    });

    return votationDiv;
  });

  const addVote = (
    voteNumber: number,
    votationInstance: Votation,
    option: Option,
  ): void => {
    try {
      votationInstance.addVote(voteNumber);
      const totalVotes = document.getElementById(
        `${option.NumberToVote}`,
      ) as HTMLSpanElement;
      totalVotes.innerText = String(option.TotalNumberOfVotes);
    } catch (e) {
      alert(e.message);
    }
  };

  votingInHtml.forEach((div) => {
    document.querySelector(".list-votings")?.appendChild(div);
  });
};

// end functions

addOptionBtn.addEventListener("click", () => {
  addOption();
});

form.addEventListener("submit", (e: Event) => {
  e.preventDefault();
  createVoting(options);
});
