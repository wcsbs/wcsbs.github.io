#!/usr/bin/env ruby

require 'nokogiri'

def refresh_one_file(template_file, input_file, output_file, level)
  template = File.read(template_file)
  doc = File.open(input_file) { |f| Nokogiri::HTML(f) }
  node = doc.at_css('article')
  
  if node.first_element_child['class'] == "smartideo"
    #puts "Removed smartvideo <div>"
    node.first_element_child.remove
  end

  result = template.sub('<article />', node.to_s)
  result = result.gsub('title_to_be_replaced', doc.title)

  if level > 0
    rel_path = ''
    while level > 0 
      rel_path = rel_path + "../"
      level -= 1
    end
    puts rel_path
    result = result.gsub('./', rel_path)
  end

  File.open(output_file, 'w') { |file| file.write(result) } 
  puts "Done for #{doc.title} - #{output_file}"
end

# def process_list(input_file)
#   doc = File.open(input_file) { |f| Nokogiri::HTML(f) }
#   puts doc.title

#   doc.css('h1').each do |h1|
#     href = h1.parent['href']
#     filename = href.sub('/', '/rxl/index.php/archives/')
#     puts "Processing #{h1.text} #{filename} ..."
#     refresh_one_file(filename)
#   end
#   nil
# end

def main
  template_file = ARGV[0]
  #puts "template_file: #{template_file}"

  input_file = ARGV[1]
  #puts "input_file: #{input_file}"

  output_file = input_file
  if ARGV.length > 2
    output_file = ARGV[2]
  end

  level = 0
  if ARGV.length > 3
    puts "ARGV[3]: #{ARGV[3]}"
    level = ARGV[3].to_i
  end

  refresh_one_file(template_file, input_file, output_file, level)

end


if __FILE__ == $0
  usage = <<-EOU

usage: ruby #{File.basename($0)} template_file input_file  (optional)output_file (optional)level

  EOU

  abort usage if ARGV.length < 2

  main

end

if __FILE__ == $0
  #process_list('list1.html')
  #process_list('list2.html')
end