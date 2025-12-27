import { Request, Response } from "express";
import productService from "../services/productService";

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await productService.getAvailableProducts();
    res.json(products);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await productService.getProductById(req.params.id);
    res.json(product);
  } catch (error: any) {
    if (error.message === "Product not found") {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    await productService.createProducts(req.body);
    res.status(201).json({ message: "Product created successfully" });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const updatedProduct = await productService.updateProduct(
      req.params.id,
      req.body
    );
    res.json(updatedProduct);
  } catch (error: any) {
    if (error.message === "Product not found") {
      res.status(404).json({ message: error.message });
    } else {
      res.status(400).json({ message: error.message });
    }
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    await productService.deleteProduct(req.params.id);
    res.json({ message: "Product removed" });
  } catch (error: any) {
    if (error.message === "Product not found") {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};
