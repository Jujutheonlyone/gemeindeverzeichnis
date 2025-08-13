import {Repository} from "typeorm";
import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Kreis} from "../../entities";

@Injectable()
export class KreisService {
    constructor(
        @InjectRepository(Kreis)
        private readonly repo: Repository<Kreis>,
    ) {}

    list() {
        return this.repo.find({ order: { name: 'ASC' } });
    }
}