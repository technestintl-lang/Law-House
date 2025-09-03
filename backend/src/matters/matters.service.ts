import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Matter } from './matter.entity';
import { MatterCreateDto, MatterUpdateDto, MatterStatus } from '@shared/types/matter';

@Injectable()
export class MattersService {
  constructor(
    @InjectRepository(Matter)
    private mattersRepository: Repository<Matter>,
  ) {}

  async findAll(firmId: string): Promise<Matter[]> {
    return this.mattersRepository.find({ where: { firmId } });
  }

  async findByClient(clientId: string, firmId: string): Promise<Matter[]> {
    return this.mattersRepository.find({ where: { clientId, firmId } });
  }

  async findByAttorney(attorneyId: string, firmId: string): Promise<Matter[]> {
    return this.mattersRepository.find({ where: { responsibleAttorneyId: attorneyId, firmId } });
  }

  async findOne(id: string, firmId: string): Promise<Matter> {
    const matter = await this.mattersRepository.findOne({ 
      where: { id, firmId } 
    });
    
    if (!matter) {
      throw new NotFoundException(`Matter with ID ${id} not found`);
    }
    
    return matter;
  }

  async create(matterDto: MatterCreateDto): Promise<Matter> {
    // Set default open date to today if not provided
    if (!matterDto.openDate) {
      matterDto.openDate = new Date();
    }
    
    // Set default status to OPEN if not provided
    if (!matterDto.status) {
      matterDto.status = MatterStatus.OPEN;
    }
    
    const matter = this.mattersRepository.create(matterDto);
    return this.mattersRepository.save(matter);
  }

  async update(id: string, firmId: string, matterDto: MatterUpdateDto): Promise<Matter> {
    const matter = await this.findOne(id, firmId);
    
    // If status is being changed to CLOSED, set closeDate to today if not provided
    if (matterDto.status === MatterStatus.CLOSED && !matterDto.closeDate) {
      matterDto.closeDate = new Date();
    }
    
    await this.mattersRepository.update(id, matterDto);
    return this.findOne(id, firmId);
  }

  async remove(id: string, firmId: string): Promise<void> {
    const matter = await this.findOne(id, firmId);
    await this.mattersRepository.remove(matter);
  }
}

