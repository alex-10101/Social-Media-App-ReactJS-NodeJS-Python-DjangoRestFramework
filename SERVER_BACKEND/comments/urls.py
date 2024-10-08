from django.urls import path
from .views import CommentListCreateApiView, CommentDetailApiView

urlpatterns = [
    path("", CommentListCreateApiView.as_view(), name="list_create_comment"),
    path("<int:commentId>", CommentDetailApiView.as_view(), name="detail_comment"),
]
