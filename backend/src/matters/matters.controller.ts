import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { MattersService } from './matters.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MatterCreateDto, MatterUpdateDto } from '@shared/types/matter';

@ApiTags('matters')
@Controller('matters')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MattersController {
  constructor(private readonly mattersService: MattersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all matters for the firm' })
  @ApiResponse({ status: 200, description: 'Return all matters for the firm' })
  @ApiQuery({ name: 'clientId', required: false, description: 'Filter by client ID' })
  @ApiQuery({ name: 'attorneyId', required: false, description: 'Filter by attorney ID' })
  findAll(
    @Request() req,
    @Query('clientId') clientId?: string,
    @Query('attorneyId') attorneyId?: string,
  ) {
    const firmId = req.user.firmId;
    
    if (clientId) {
      return this.mattersService.findByClient(clientId, firmId);
    }
    
    if (attorneyId) {
      return this.mattersService.findByAttorney(attorneyId, firmId);
    }
    
    return this.mattersService.findAll(firmId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a matter by ID' })
  @ApiResponse({ status: 200, description: 'Return a matter by ID' })
  @ApiResponse({ status: 404, description: 'Matter not found' })
  findOne(@Param('id') id: string, @Request() req) {
    return this.mattersService.findOne(id, req.user.firmId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new matter' })
  @ApiResponse({ status: 201, description: 'Matter created successfully' })
  create(@Body() createMatterDto: MatterCreateDto, @Request() req) {
    // Ensure the matter is created for the user's firm
    createMatterDto.firmId = req.user.firmId;
    return this.mattersService.create(createMatterDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a matter' })
  @ApiResponse({ status: 200, description: 'Matter updated successfully' })
  @ApiResponse({ status: 404, description: 'Matter not found' })
  update(
    @Param('id') id: string,
    @Body() updateMatterDto: MatterUpdateDto,
    @Request() req,
  ) {
    return this.mattersService.update(id, req.user.firmId, updateMatterDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a matter' })
  @ApiResponse({ status: 200, description: 'Matter deleted successfully' })
  @ApiResponse({ status: 404, description: 'Matter not found' })
  remove(@Param('id') id: string, @Request() req) {
    return this.mattersService.remove(id, req.user.firmId);
  }
}

