interface TrelloCard {
  id: string;
  closed: boolean;
  idBoard: string;
  idList: string;
  name: string;
  desc: string;
}

export default TrelloCard;
