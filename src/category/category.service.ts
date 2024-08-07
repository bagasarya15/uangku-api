import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { v4 as uuidv4 } from 'uuid';
import { category } from '../../models';
import { responsePaginate } from '../helpers/response-paginate';
import { Op } from 'sequelize';

@Injectable()
export class CategoryService {
  async selectCategory(params: string, userId: string) {
    try {
      const collection = await category.findAll({
        where: { category_type: params, user_id: userId },
      });

      if (!collection || collection.length === 0) {
        return { status: 404, message: 'Category not found' };
      }

      return { status: 200, message: 'Success', records: collection };
    } catch (error) {
      return {
        status: 500,
        message: 'Internal server error',
        error: error.message,
      };
    }
  }

  async create(body: CreateCategoryDto) {
    try {
      const myUUID = uuidv4();
      const { category_name, category_type, user_id } = body;

      const existingCategory = await category.findOne({
        where: { category_name, user_id, category_type },
      });

      if (existingCategory) {
        throw new HttpException(
          {
            status: 400,
            message: 'Category already exist',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const data = await category.create({
        id: myUUID,
        category_name: category_name,
        category_type: category_type,
        user_id: user_id,
      });

      return {
        status: 201,
        message: 'Create category successfully',
        result: data,
      };
    } catch (error) {
      throw error;
    }
  }

  async findAll(body: {
    page: number;
    limit: number;
    search: string;
    user_id: string;
  }) {
    try {
      const { page, limit, search, user_id } = body;
      const offset = (page - 1) * limit;
      let whereClause: any = { user_id };
      let orderClause: any = [['created_at', 'DESC']];

      if (search) {
        whereClause = {
          ...whereClause,
          [Op.or]: [{ category_name: { [Op.like]: `%${search}%` } }],
        };
      }

      const data = await category.findAll({
        where: whereClause,
        limit,
        offset,
        order: orderClause,
      });

      const totalCount = await category.count({ where: whereClause });

      return responsePaginate(data, totalCount, page, limit);
    } catch (error) {
      throw error;
    }
  }

  async update(body: UpdateCategoryDto) {
    try {
      const { id, category_name, category_type, user_id } = body;

      const existingCategory = await category.findOne({
        where: { category_name, category_type, id: { [Op.not]: id } },
      });

      if (existingCategory) {
        throw new HttpException(
          {
            status: 400,
            message: 'Category name already exists for another category',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const updatedCategory = await category.update(
        {
          category_name: category_name,
          category_type: category_type,
          user_id: user_id,
        },
        { where: { id: id }, returning: true },
      );

      return {
        status: 200,
        message: 'Category updated successfully',
        result: updatedCategory,
      };
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string) {
    try {
      const deletedCategory = await category.destroy({ where: { id } });

      if (deletedCategory === 0) {
        throw new HttpException(
          {
            status: 404,
            message: 'Category not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        status: 200,
        message: 'Category deleted successfully',
      };
    } catch (error) {
      throw error;
    }
  }
}
