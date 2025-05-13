package com.example.FirstGrocery.Service;

import com.example.FirstGrocery.Dto.SubCategoryDto;
import com.example.FirstGrocery.Model.Category;
import com.example.FirstGrocery.Model.SubCategory;
import com.example.FirstGrocery.Repository.SubCategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SubCategoryService {

    private final SubCategoryRepository subCategoryRepository;
    private final CategoryService categoryService;

            public List<SubCategory> getAllSubCategories(){
                return  subCategoryRepository.findAll();
            }

            public Optional<SubCategory> getSubCategoryById(Long id){
                return subCategoryRepository.findById(id);
            }
            public SubCategory createSubCategory(SubCategory subCategory){
                return subCategoryRepository.save(subCategory);
            }
            public SubCategory updateSubCategory(Long id, SubCategoryDto subCategory){
                return subCategoryRepository.findById(id).map(
                        subCategory1 -> {
                            subCategory1.setName(subCategory.getName());
                            subCategory1.setImageUrl(subCategory.getImage());
                            if(subCategory.getCategoryId() !=null){
                                Optional<Category> categoryById = categoryService.getCategoryById(subCategory.getCategoryId());
                                if(categoryById.isPresent()){
                                    subCategory1.setCategory(categoryById.get());
                                }else {
                                    throw new RuntimeException("Category not found with id " + subCategory.getCategoryId());
                                }
                            }
                            return subCategoryRepository.save(subCategory1);

                        }
                ).orElseThrow(() ->new RuntimeException("subcategory not found with id"));
            }

            public boolean deleteSubCategory(Long id){
                subCategoryRepository.deleteById(id);

                return false;
            }

            public List<SubCategory> getSubCategoriesByCategoryId(Long cid){
                List<SubCategory> subCategories = subCategoryRepository.findByCategoryCid(cid);
                 if(subCategories.isEmpty()){
                     System.out.println("null");
                 }
                return subCategories; // Return the found subcategories

            }


}
