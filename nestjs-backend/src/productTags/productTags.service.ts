import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import ProductTag from './model/productTag.model';
import { Op } from 'sequelize';

@Injectable()
export class ProductTagsService {
  constructor(
    @InjectModel(ProductTag)
    private readonly productTagModel: typeof ProductTag, //
  ) {}

  findTagsByName(names: string[]): Promise<ProductTag[]> {
    return this.productTagModel.findAll({
      where: {
        name: {
          [Op.in]: names,
        },
      },
    });
  }

  removePrevTagsFromProductTags(
    prevProductTags: ProductTag[],
    productTags: string[],
  ): string[] {
    return productTags.filter((tagName) => {
      if (!prevProductTags.find((prevTag) => prevTag.name === tagName)) {
        return true;
      }
      return false;
    });
  }

  bulkInsert(names: string[]): Promise<ProductTag[]> {
    const nameObjects = this.getNameObjects(names);
    return this.productTagModel.bulkCreate(nameObjects);
  }

  // [{ name: 'adfdaf' }, { name: 'dfadf34' }, ...]
  getNameObjects(names: string[]): { name: string }[] {
    return names.map((name) => {
      return { name };
    });
  }
}
