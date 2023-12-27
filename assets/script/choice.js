function choice_question(query){
    var ids = {}
    // random seed function
    function random_seed(){
        var seed
        do {
            seed = Math.floor(Math.random()*10000000)
        }
        while (ids[seed])
        ids[seed] = true
        return seed
    }
    function find_element_choosed(node){
        return node.querySelector('input:checked')
    }
    // assign function
    function gotoUrl(url){
        window.location.assign(url)
    }
    // mix question
    function mix_question(array){
        var result = []
        var array_length = array.length
        for (var i = 0; i<array_length; i++){
            var random_index = Math.floor(Math.random()*array.length)
            result.push(array[random_index])
            result[result.length-1].index = `Câu ${i+1} :`
            array.splice(random_index,1)
        }
        return result
    }
    // mix
    query.question_list = mix_question(query.question_list)
    // select element
    var formElement = document.querySelector(query.form)
    var submitBtn = document.querySelector(query.submit_selector)
    var right_ans_count_element = document.querySelector(query.rightCount)
    var moveBtn = document.createElement('button')
    // nav select
    var navELement = document.createElement('select')
    // add class
    if (query.nav_question_select_css){
        navELement.classList.add(query.nav_question_select_css)
    }
    if (query.moveBtn_css){
        moveBtn.classList.add(query.moveBtn_css)
    }
    // add content
    moveBtn.textContent = query.moveBtn_content
    var answer_element_list = []
    var input_element_list = []
    Array.from(query.question_list).forEach(function(question){
        // create element
        var question_box = document.createElement('div')
        var question_element = document.createElement('div')
        var index_element = document.createElement('b')
        var question_content_element = document.createElement('span')
        var answer_list_element = document.createElement('ul')
        var required_mess_element = document.createElement('span')
        var note_element = document.createElement('span')
        // random seed
        var seed = random_seed()
        // answer handler
        if (typeof question.answer === 'number') question.answer = question.answer_list[question.answer-1]
        // add class
        question_content_element.classList.add(query.question_content_css)
        index_element.classList.add(query.question_index_css)
        question_element.classList.add(query.element_class)
        question_box.classList.add(query.question_box)
        answer_list_element.classList.add(query.answer_list_css)
        required_mess_element.classList.add(query.require_mess_css)
        if (query.note_css){
            note_element.classList.add(query.note_css)
        }
        // add content 
        index_element.textContent = question.index
        question_content_element.textContent = question.question_content
        required_mess_element.textContent = query.require_mess
        note_element.textContent = "Giải thích: " + (question.explain || "Tạm thời chưa có giải thích")
        // set attribute
        question_element.id = seed
        // add style
        required_mess_element.style.display = 'none'
        note_element.style.display = 'none'
        // add answer item
        var count = 0
        var rightElement
        Array.from(question.answer_list).forEach(function(answer){
            // create element
            var answer_item_element = document.createElement('li')
            var input_element = document.createElement('input')
            var label_element = document.createElement('label')
            var answer_index = document.createElement('b')
            var answer_content = document.createElement('span')
            var seed = random_seed()
            // add class
            answer_item_element.classList.add(query.answer_box)
            input_element.type = 'radio'
            input_element.name = question.index
            input_element.id = seed
            label_element.setAttribute('for', seed)
            answer_index.classList.add(query.answer_index_css)
            answer_content.classList.add(query.answer_content_css)
            // add content
            answer_index.textContent = String.fromCharCode(65 + count ++ ) + '. '
            answer_content.textContent = answer
            // add element
            answer_item_element.appendChild(input_element)
            label_element.appendChild(answer_index)
            label_element.appendChild(answer_content)
            answer_item_element.appendChild(label_element)
            answer_list_element.appendChild(answer_item_element)
            // choose right answer
            if (answer === question.answer) rightElement = answer_item_element
            // add input element into input element list
            input_element_list.push(input_element)
        })
        // when user input
        answer_list_element.addEventListener('click', function(e){
            if (e.target.tagName === 'INPUT'){
                // remove require mess
                required_mess_element.style.display = 'none'
            }
        })
        // add element
        formElement.appendChild(question_element)
        question_element.appendChild(question_box)
        question_box.appendChild(index_element)
        question_box.appendChild(question_content_element)
        answer_element_list.push({
            element : answer_list_element,
            right : rightElement,
            required : required_mess_element,
            explain : question.explain || 'Tạm thời chưa có lời giải',
            index : question.index,
            note : note_element
        })
        question_element.appendChild(answer_list_element)
        question_element.appendChild(required_mess_element)
        question_element.appendChild(note_element)
    })
    // submit answer
    var isFirst = true
    submitBtn.addEventListener('click', function(e){
        // validator
        var isChooseAll = true
        answer_element_list.forEach(function(element){
            var element_choosed = find_element_choosed(element.element)
            if (!element_choosed){
                element.required.style.display = 'inline-block'
                isChooseAll = false
            }
        })
        if (isChooseAll && isFirst){
            // after submit
            isFirst = false
            // check answer
            var rightAnswerList = []
            var wrongAnswerList = []
            var right_answers = 0
            var index = 0
            answer_element_list.forEach(function(element){
                var element_choosed = find_element_choosed(element.element)
                if (element_choosed){
                    var parentElementChoosed = element_choosed.parentElement
                    // choose right answer
                    if (parentElementChoosed === element.right){
                        right_answers++
                        rightAnswerList.push(++index)
                    }
                    // choose wrong answer
                    else{
                        parentElementChoosed.classList.add(query.error_css)
                        wrongAnswerList.push(++index)
                    }
                    // after submit
                    element.right.classList.add(query.success_css)
                    element.note.style.display = 'inline-block'
                }
            })
            // right wrong handler
            var rightCountMess = rightAnswerList.join(', ') || 'Không có câu nào đúng'
            var wrongCountMess = wrongAnswerList.join(', ') || "Không có câu nào sai"
            var point = right_answers*query.max_point/(query.question_list.length)
            // show point
            var right_count = document.createElement('p')
            var wrongAnswerElement = document.createElement('p')
            var rightAnswerElement = document.createElement('p')
            var pointELement = document.createElement('p')
            // add class 
            rightAnswerElement.classList.add(query.right_css)
            wrongAnswerElement.classList.add(query.wrong_css)
            // add textContent
            rightAnswerElement.textContent = `Các câu bạn đã làm đúng: ${rightCountMess}`
            wrongAnswerElement.textContent = `Các câu bạn đã làm sai: ${wrongCountMess}`
            right_count.textContent = `Bạn đã làm đúng ${right_answers}/${query.question_list.length} câu`
            pointELement.textContent = `Số điểm bạn đạt được: ${point.toFixed(2)}/${query.max_point} Điểm`
            // add element to right_ans_count_element
            right_ans_count_element.appendChild(rightAnswerElement)
            right_ans_count_element.appendChild(wrongAnswerElement)
            right_ans_count_element.appendChild(pointELement)
            right_ans_count_element.appendChild(right_count)
            // disable inputs
            input_element_list.forEach(function(input_element){
                input_element.setAttribute('disabled', true)
            })
        }
    })
}