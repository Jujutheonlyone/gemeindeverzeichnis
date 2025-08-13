import {InjectRepository} from "@nestjs/typeorm";
import {Injectable} from "@nestjs/common";
import {State} from "../../entities";
import {Repository} from "typeorm";

@Injectable()
export class StatesService {
    constructor(
        @InjectRepository(State)
        private readonly repo: Repository<State>,
    ) {}

    list() {
        return this.repo.find({ order: { name: 'ASC' } });
    }
}