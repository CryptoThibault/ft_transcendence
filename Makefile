#exec shell command
exec:
	@echo "Available containers:"; \
	docker ps --format "table {{.ID}}\t{{.Names}}\t{{.Status}}"; \
	echo ""; \
	read -p "Enter container ID or name: " container_name; \
	docker exec -it $$container_name /bin/sh
#logs command
logs:
	@echo "Available containers:"; \
	docker ps --format "table {{.ID}}\t{{.Names}}\t{{.Status}}"; \
	echo ""; \
	read -p "Enter container ID or name: " container_name; \
	docker logs -f $$container_name

# stop and remove all containers, images, volumes and networks
clean-docker:
	@docker stop $$(docker ps -qa) 2>/dev/null || true
	@docker rm $$(docker ps -qa) 2>/dev/null || true
	@docker rmi -f $$(docker images -qa) 2>/dev/null || true
	@docker volume rm $$(docker volume ls -q) 2>/dev/null || true
	@docker network rm $$(docker network ls -q | grep -v bridge | grep -v host | grep -v none) 2>/dev/null || true

dev: 
	echo "Stopping and removing the containers"
	docker-compose down --volumes
	echo "Building the images and starting the containers"
	docker-compose up --build
