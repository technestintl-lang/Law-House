import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from './client.entity';
import { ClientCreateDto, ClientUpdateDto } from '@shared/types/client';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private clientsRepository: Repository<Client>,
  ) {}

  async findAll(firmId: string): Promise<Client[]> {
    return this.clientsRepository.find({ where: { firmId } });
  }

  async findOne(id: string, firmId: string): Promise<Client> {
    const client = await this.clientsRepository.findOne({ 
      where: { id, firmId } 
    });
    
    if (!client) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }
    
    return client;
  }

  async create(clientDto: ClientCreateDto): Promise<Client> {
    const client = this.clientsRepository.create(clientDto);
    return this.clientsRepository.save(client);
  }

  async update(id: string, firmId: string, clientDto: ClientUpdateDto): Promise<Client> {
    const client = await this.findOne(id, firmId);
    
    await this.clientsRepository.update(id, clientDto);
    return this.findOne(id, firmId);
  }

  async remove(id: string, firmId: string): Promise<void> {
    const client = await this.findOne(id, firmId);
    await this.clientsRepository.remove(client);
  }
}

