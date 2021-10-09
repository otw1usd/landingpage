import os
# Function to rename multiple files
# --INPUT--
km = 301
# -------

p = 1

while p<5:
   z = 1
   while z < 5:
      def main():
         i = 1
         path="C:/xampp/htdocs/test/dataset/drawing/KM-"+str(km)+"/Page"+str(p)+"/z"+str(z)+"/images/"
         for filename in os.listdir(path):
            my_dest =str(i) + ".jpg"
            my_source =path + filename
            my_dest =path + my_dest
            # rename() function will
            # rename all the files
            os.rename(my_source, my_dest)
            i += 1
      # Driver Code
      if __name__ == '__main__':
         # Calling main() function
         main() 
      z+=1
   p+=1