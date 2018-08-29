export class Rent{
    public Start:Date;
    public End:Date;
    public Branch:number;
    public Vehicle:number;
    public User:string;
    public Bill:string;

    constructor(branch:number){
        this.Branch = branch;
    }
}