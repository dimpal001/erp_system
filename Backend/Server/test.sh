curl -X POST http://localhost:4000/graphql \
  -H "Authorization: Bearer yJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpbnN0aXR1dGVJZCI6IlFGREhIQyIsImlkIjoiY201MWQ3bXBkMDAwMHBnM3J5cWR3eHlqNCIsIm5hbWUiOiJiYWphbGkgY29sbGVnZSIsInR5cGUiOiJDT0xMRUdFIiwiaWF0IjoxNzM0OTgwNDAyLCJleHAiOjE3MzU1ODUyMDJ9.YXUKg2GPEbhmC5WYFzW7qDfseFKIThIngNC-F30ekhc" \
  -H "Content-Type: application/json" \
  -d '{"query": "{ getInstituteData { id name } }"}'
