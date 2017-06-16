require 'rubygems'
require 'bundler/setup'
# Bundler.require(:default)

require 'sshkit'
require 'sshkit/dsl'
include SSHKit::DSL

require 'yaml'
require 'securerandom'
require 'pry'

SSHKit.config.output_verbosity = Logger::DEBUG

project_path = '~'
project_name = 'undefined'

git_url = 'undefined'

expose_to_port = 'undefined'

cluster_nodes = [
  # 'ikamiut.greenland.hoppinger.com',
  'rodebay.greenland.hoppinger.com'
]

num_deploys_to_keep = 5

image_tag = "#{project_name}:#{Time.now.to_i}"
project_dir = "#{project_path}/#{project_name}"

# Checkout code and build container
on cluster_nodes, in: :parallel do |host|
  execute :mkdir, project_dir unless test("[ -d #{project_dir} ]")

  within project_dir do
    execute :rm, '-rf repo'
    execute :git, "clone #{git_url} repo"

    within 'repo' do
      execute :docker, "build --force-rm -f Dockerfile.staging -t #{image_tag} ."
    end
  end
end

# Run DB migrations
on cluster_nodes.first, in: :parallel do |host|
  execute :docker, "run -t #{image_tag} dotnet ef database update -c MonadicComponentsContext"
end

# Cleanup old images and fire up container
on cluster_nodes, in: :parallel do |host|
  images = (capture :docker, "images -a --format=\"{{.ID}}:{{.Repository}}:{{.Tag}}\"").split("\n")
            .map{|image| image.split(":")}
            .select{|(id,name,tag)| name == project_name}

  images.each do |id, name, tag|
    p "Stopping #{[id, name, tag]}"

    begin
      execute :docker, "rm $(docker stop $(docker ps -a -q --filter ancestor=#{name}:#{tag} --format=\"{{.ID}}\"))"

      p "Stopped #{[id, name, tag]}"
    rescue
      p "Cannot stop #{[id, name, tag]} as it is not running"
    end
  end

  images = images.select{ |id, name, tag| tag.to_i.to_s == tag }
            .map { |id, name, tag| [id, name, tag.to_i] }
            .sort_by { |id, name, tag| tag }
            .reverse

  all_images_but_newest = images.drop num_deploys_to_keep
  all_images_but_newest.each do |id, name, tag|
    execute :docker, "rmi #{name}:#{tag}"
  end

  execute :docker, "run --restart=always -d -p 0.0.0.0:#{expose_to_port}:5000 -t #{image_tag}"
end
