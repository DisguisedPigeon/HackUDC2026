import back
import ui

def mainloop():
    """ Main function loop"""
    data = get_pdf_data()
    render(data)


if __name__ == "__main__":
    exit = False
    while not exit:
        exit = mainloop()

