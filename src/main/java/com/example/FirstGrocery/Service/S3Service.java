package com.example.FirstGrocery.Service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.example.FirstGrocery.FrershGorceryException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class S3Service implements FileService{

    private static final String BUCKET_NAME = "sam-bucke50720";
    private final AmazonS3 amazonS3;  // Corrected to use AmazonS3 interface

    @Override
    public String upload(MultipartFile file) {
        // Extract the file extension
        String extension = StringUtils.getFilenameExtension(file.getOriginalFilename());
        String key = String.format("%s.%s", UUID.randomUUID(), extension);

        // Set up metadata for the file
        var metadata = new ObjectMetadata();
        metadata.setContentLength(file.getSize());
        metadata.setContentType(file.getContentType());

        try {
            // Upload file to S3 bucket
            amazonS3.putObject(BUCKET_NAME, key, file.getInputStream(), metadata);
        } catch (IOException e) {
            throw new FrershGorceryException("An exception occurred while uploading the file", e);
        }

        // Make the uploaded file publicly accessible
        amazonS3.setObjectAcl(BUCKET_NAME, key, CannedAccessControlList.PublicRead);

        // Return the URL of the uploaded file
        return amazonS3.getUrl(BUCKET_NAME, key).toString();
    }

}
