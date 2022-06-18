from rest_framework import viewsets, status
from rest_framework.response import Response


from api.Utils.getUser import getUserId
from api.Seriailzers.PostSerializer import PostsSerializer, PostsCreateSerializer
from books.models import ReviewPost

from books.models import ReviewBook
class PostViewSet(viewsets.ModelViewSet):
	serializer_class = PostsSerializer
	def list(self, request, book_id):
		print(book_id)
		print(request.user.id)
		try :
			userid = getUserId(request.user)
			queryset = ReviewBook.objects.filter(user_id = userid)
			queryset = ReviewPost.objects.get(user_id = userid, )
		except :
			return Response({"msg" : "Post가 없습니다."}, status=status.HTTP_200_OK)
		serializer = PostsSerializer(queryset, many=True)
		return Response(serializer.data, status=status.HTTP_200_OK)
	
	def create(self, request, book_id, *args, **kwargs):
		serializer = PostsCreateSerializer(data=request.data)
		if serializer.is_valid():
			rtn = serializer.create(request, book_id, serializer.data)
			if rtn:
				return Response(PostsSerializer(rtn).data, status=status.HTTP_201_CREATED)
		else :
			return Response({"msg" : "데이터 잘못됨"}, status=status.HTTP_200_OK)
	
	def retrieve(self, request, book_id, pk, *args, **kwargs):
		return super().retrieve(request, *args, **kwargs)
	
	def destroy(self, request, book_id, pk, *args, **kwargs):
		return super().destroy(request, *args, **kwargs)