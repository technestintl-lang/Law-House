import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ClientsService } from './clients.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ClientCreateDto, ClientUpdateDto } from '@shared/types/client';

@ApiTags('clients')
@Controller('clients')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all clients for the firm' })
  @ApiResponse({ status: 200, description: 'Return all clients for the firm' })
  findAll(@Request() req) {
    return this.clientsService.findAll(req.user.firmId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a client by ID' })
  @ApiResponse({ status: 200, description: 'Return a client by ID' })
  @ApiResponse({ status: 404, description: 'Client not found' })
  findOne(@Param('id') id: string, @Request() req) {
    return this.clientsService.findOne(id, req.user.firmId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new client' })
  @ApiResponse({ status: 201, description: 'Client created successfully' })
  create(@Body() createClientDto: ClientCreateDto, @Request() req) {
    // Ensure the client is created for the user's firm
    createClientDto.firmId = req.user.firmId;
    return this.clientsService.create(createClientDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a client' })
  @ApiResponse({ status: 200, description: 'Client updated successfully' })
  @ApiResponse({ status: 404, description: 'Client not found' })
  update(
    @Param('id') id: string,
    @Body() updateClientDto: ClientUpdateDto,
    @Request() req,
  ) {
    return this.clientsService.update(id, req.user.firmId, updateClientDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a client' })
  @ApiResponse({ status: 200, description: 'Client deleted successfully' })
  @ApiResponse({ status: 404, description: 'Client not found' })
  remove(@Param('id') id: string, @Request() req) {
    return this.clientsService.remove(id, req.user.firmId);
  }
}

