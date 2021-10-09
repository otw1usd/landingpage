import os
import cv2


fixwidthlist = [200,1024,2048,4966,9933]

# input
km = 299
# ------	
p = 1


while p<5:
	z = 0
	while z <5:
		fixwidth=fixwidthlist[z]
		img = cv2.imread('C:/xampp/htdocs/test/dataset/drawing/KM-'+str(km)+'/Original PNG/Page'+str(p)+'.png', cv2.IMREAD_UNCHANGED)

		print('Original Dimensions : ', img.shape)

		scale_percent = fixwidth/img.shape[1] # percent of original size
		print(scale_percent)
		width = int(img.shape[1] * scale_percent)
		height = int(img.shape[0] * scale_percent)
		dim = (width, height)

		# resize image
		resized = cv2.resize(img, dim, interpolation = cv2.INTER_AREA)

		print('Resized Dimensions : ',resized.shape)
		cv2.imwrite('C:/xampp/htdocs/test/dataset/drawing/KM-'+str(km)+'/Original PNG/z'+str(z)+'-Page'+str(p)+'.png', resized)
		z+=1
	p+=1



