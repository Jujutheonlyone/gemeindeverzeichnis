import {Repository} from "typeorm";
import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {PadleCourt} from "../../entities";

@Injectable()
export class PadleCourtService {
    constructor(
        @InjectRepository(PadleCourt)
        private readonly repo: Repository<PadleCourt>,
    ) {}

    list() {
        return this.repo.find({ order: { name: 'ASC' } });
    }
}