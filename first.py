# Importing the libraries
import numpy as np  # Import numpy library for numerical operations and handling NaN values
import pandas as pd  # Import pandas library for data manipulation and analysis

# Read the CSV file into a pandas DataFrame
df = pd.read_csv(r"F:\Coding\Python\Uncleaned.csv") 

# Display the first 10 rows of the DataFrame
df.head(10)  

# Display information about the DataFrame including data types and non-null counts
df.info()  

# Get the dimensions of the DataFrame (rows, columns)
df.shape 

# Count the number of missing values in each column
missing_count = df.isnull().sum()  
# Print the missing value counts to the console
print(missing_count)  

# Replace the string "Sixty Thousand" with numeric value 60000 in the Salary column
df["Salary"] = df["Salary"].replace("Sixty Thousand", 60000)  

 # Convert the Salary column to numeric data type
df["Salary"] = pd.to_numeric(df["Salary"]) 

# Fill missing values in Salary column with the mean salary
df["Salary"] = df["Salary"].fillna(df["Salary"].mean())  

# Set Age values that are less than 18 or greater than 60 to NaN (outlier handling)
df.loc[(df["Age"]<18) | (df["Age"]>60), "Age"] = np.nan  

# Fill missing values in Age column with the mean age
df["Age"] = df["Age"].fillna(df["Age"].mean())  

print("\nMissing Values After Cleaning:")
print(df.isnull().sum())

df["Gender"].value_counts()


valid_gender=["Male", "Female"]
df["Gender"]=df["Gender"].apply(lambda i: i if i in valid_gender else "Others")
df["Gender"].value_counts()
 

