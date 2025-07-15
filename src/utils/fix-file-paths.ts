import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FileSchemaClass } from '../files/infrastructure/persistence/document/entities/file.schema';
import { ProductSchemaClass } from '../products/infrastructure/persistence/document/entities/products.schema';

@Injectable()
export class FixFilePathsService {
  constructor(
    @InjectModel('File') private readonly fileModel: Model<FileSchemaClass>,
    @InjectModel('Product')
    private readonly productModel: Model<ProductSchemaClass>,
  ) {}

  async fixFilePaths() {
    console.log('Starting to fix file paths...');

    // Fix files collection
    const files = await this.fileModel.find({});
    let fixedFiles = 0;

    for (const file of files) {
      if (
        file.path &&
        (file.path.startsWith('http://') || file.path.startsWith('https://'))
      ) {
        // Extract the key from the URL
        const url = new URL(file.path);
        const pathname = url.pathname;
        const key = pathname.startsWith('/') ? pathname.substring(1) : pathname;

        // Update the file path to just the key
        await this.fileModel.updateOne(
          { _id: file._id },
          { $set: { path: key } },
        );

        console.log(`Fixed file ${file._id}: ${file.path} -> ${key}`);
        fixedFiles++;
      }
    }

    console.log(`Fixed ${fixedFiles} files`);

    // Fix products collection
    const products = await this.productModel.find({});
    let fixedProducts = 0;

    for (const product of products) {
      if (product.images && product.images.length > 0) {
        let hasChanges = false;
        const updatedImages = product.images.map((image) => {
          if (
            image.path &&
            (image.path.startsWith('http://') ||
              image.path.startsWith('https://'))
          ) {
            // Extract the key from the URL
            const url = new URL(image.path);
            const pathname = url.pathname;
            const key = pathname.startsWith('/')
              ? pathname.substring(1)
              : pathname;

            console.log(
              `Fixed product image ${product._id}: ${image.path} -> ${key}`,
            );
            hasChanges = true;

            return {
              ...image,
              path: key,
            };
          }
          return image;
        });

        if (hasChanges) {
          await this.productModel.updateOne(
            { _id: product._id },
            { $set: { images: updatedImages } },
          );
          fixedProducts++;
        }
      }
    }

    console.log(`Fixed ${fixedProducts} products`);
    console.log('File path fixing completed!');
  }
}
