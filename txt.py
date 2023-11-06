import os

def gather_files_in_directory(root_folder, extensions):
    """Recursively gather files from a directory based on a list of extensions while ignoring specific folders."""
    files_found = []
    ignore_folders = {"modules", "node_modules", ".git"}
    for foldername, subfolders, filenames in os.walk(root_folder):
        should_skip = any(ignored_folder in foldername.split(os.sep) for ignored_folder in ignore_folders)
        if should_skip:
            del subfolders[:]
            continue
        
        for filename in filenames:
            if filename.endswith(tuple(extensions)):
                files_found.append(os.path.join(foldername, filename))
    return files_found


def concatenate_filenames_and_contents(files):
    """Concatenate filenames and their contents with a newline."""
    concatenated_string = ""
    for file in files:
        with open(file, 'r', encoding='utf-8', errors='replace') as f:
            # print(file)
            concatenated_string += '\n' + file.split("/")[-1] + '\n\n' + f.read() + '\n' + "#####################\n"
    return concatenated_string

if __name__ == "__main__":
    root_folder = "/Users/arif/Documents/San_Francisco/USF/College_docs/Fall-2023/CS601/mindset/"
    skip_folders = [""]
    extensions = ['.html', '.js', '.json']
    files = gather_files_in_directory(root_folder, extensions)
    result_string = concatenate_filenames_and_contents(files)
    
    # Print or store the result_string as needed
    print(result_string)
    filename = "/Users/arif/Documents/San_Francisco/USF/College_docs/Fall-2023/CS601/mindset/output.txt"
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(result_string)

